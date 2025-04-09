import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  CreditCard 
} from "lucide-react";
import { CheckoutForm } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the checkout schema
const checkoutFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  email: z.string().email({ message: "Formato de email inválido" }),
  address: z.string().min(1, { message: "La dirección es obligatoria" }),
  city: z.string().min(1, { message: "La ciudad es obligatoria" }),
  zip: z.string().regex(/^\d{5}$/, { message: "El código postal debe tener 5 dígitos" }),
  cardNumber: z.string().refine(value => /^\d{16}$/.test(value.replace(/\s/g, '')), {
    message: "Número de tarjeta inválido (16 dígitos)"
  }),
  expiration: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: "Formato inválido (MM/YY)"
  }),
  cvv: z.string().regex(/^\d{3,4}$/, {
    message: "El CVV debe tener 3 o 4 dígitos"
  }),
});

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      zip: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
    },
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const val = value.replace(/\D/g, '').substring(0, 16);
    return val.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Format expiration date MM/YY
  const formatExpiration = (value: string) => {
    let val = value.replace(/\D/g, '').substring(0, 4);
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    return val;
  };

  // Format price as currency in Mexican Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(price);
  };

  // Submit form for step validation
  const onSubmitStep = (step: number) => {
    if (step === 1) {
      // Validate shipping information fields
      form.trigger(["name", "email", "address", "city", "zip"]).then(isValid => {
        if (isValid) {
          setCurrentStep(2);
        }
      });
    } else if (step === 2) {
      // Complete payment form validation is handled by the onSubmit
      form.handleSubmit(onSubmit)();
    }
  };

  // Handle the checkout process
  const onSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    // Temporary user ID for demo purposes
    const userId = 1;
    
    try {
      setIsSubmitting(true);
      
      // Call checkout API
      const response = await apiRequest("POST", `/api/checkout/${userId}`, data);
      
      // Handle success
      setSuccessMessage("¡Compra completada con éxito! Tu pedido está en camino.");
      setCurrentStep(3);
      await clearCart();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Error durante el pago",
        description: "Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to previous step
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Por favor, completa la información para finalizar tu pedido</p>
      </div>

      {/* Empty Cart Case */}
      {cart.length === 0 && !successMessage && (
        <div className="bg-white rounded-lg shadow p-8 border border-gray-100 text-center max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-6">Agrega algunos productos antes de proceder al pago</p>
          <Button 
            onClick={() => navigate('/products')} 
            className="px-4 py-2 bg-primary text-white"
          >
            Ver productos
          </Button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-white rounded-lg shadow p-8 border border-gray-100 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-medium mb-2">¡Compra realizada con éxito!</h3>
          <p className="text-gray-600 mb-6">{successMessage}</p>
          <p className="text-gray-500 mb-8">Te hemos enviado un correo con los detalles de tu pedido.</p>
          <Button 
            onClick={() => {
              navigate('/');
              setSuccessMessage("");
            }} 
            className="px-6 py-3 bg-primary text-white"
          >
            Volver a la tienda
          </Button>
        </div>
      )}

      {/* Checkout Flow */}
      {cart.length > 0 && !successMessage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-lg mb-1">Resumen del pedido</h2>
                <p className="text-sm text-gray-500">{cart.length} productos</p>
              </div>
              <div className="p-5 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.title} 
                      className="w-16 h-16 object-contain bg-gray-50 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium line-clamp-2">{item.product.title}</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium">
                    {cartTotal() > 1000 ? 'Gratis' : formatPrice(99.99)}
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="font-medium">{formatPrice(cartTotal() * 0.21)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    {formatPrice(
                      cartTotal() + 
                      (cartTotal() > 1000 ? 0 : 99.99) + 
                      (cartTotal() * 0.21)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
              {/* Progress Steps */}
              <div className="flex mb-8">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm text-gray-600">Información</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm text-gray-600">Pago</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm text-gray-600">Confirmación</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Step 1: Shipping Information */}
                  {currentStep === 1 && (
                    <>
                      <h2 className="text-xl font-semibold mb-6">Información de envío</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Nombre completo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduce tu nombre completo"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="tu@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Calle y número"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Introduce tu ciudad"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código postal</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12345"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Step 2: Payment Information */}
                  {currentStep === 2 && (
                    <>
                      <h2 className="text-xl font-semibold mb-6">Información de pago</h2>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de tarjeta</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    {...field}
                                    value={formatCardNumber(field.value)}
                                    onChange={(e) => {
                                      const formatted = formatCardNumber(e.target.value);
                                      field.onChange(formatted);
                                    }}
                                  />
                                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fecha de expiración</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="MM/YY"
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => {
                                      const formatted = formatExpiration(e.target.value);
                                      field.onChange(formatted);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    maxLength={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <Checkbox id="remember" className="mt-1" />
                            <Label 
                              htmlFor="remember" 
                              className="ml-3 text-sm font-medium text-gray-700"
                            >
                              Guardar esta tarjeta para futuras compras
                            </Label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              ) : (
                <div className="w-24"></div>
              )}
              
              {currentStep < 2 ? (
                <Button 
                  type="button"
                  onClick={() => onSubmitStep(currentStep)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : currentStep === 2 ? (
                <Button 
                  type="button"
                  onClick={() => onSubmitStep(currentStep)}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    <>
                      Completar compra
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
