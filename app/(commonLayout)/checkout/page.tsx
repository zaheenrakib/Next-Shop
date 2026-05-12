'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, Loader2, CreditCard, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useSession } from '@/lib/auth-client';

const districts = [
  "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail",
  "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
  "Bogra", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Rajshahi", "Sirajganj",
  "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon",
  "Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
  "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet",
  "Bandarban", "Brahmanbaria", "Chandpur", "Chittagong", "Comilla", "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"
].sort();

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // useSession call
  const session = useSession();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    upazila: '',
    district: 'Dhaka',
    mobile: '',
    email: '',
    comment: '',
    paymentMethod: 'online'
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart || JSON.parse(savedCart).length === 0) {
      router.push('/cart');
      return;
    }
    setCart(JSON.parse(savedCart));
  }, [router]);

  const shippingFee = formData.district === "Dhaka" ? 250 : 900;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity || 1)), 0);
  const total = subtotal + shippingFee;

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Checking whether the user is logged in
if (!session?.data?.user) {
  toast.error('Please log in first to confirm the order');
  router.push('/account/register');
  return;
}

if (!formData.firstName || !formData.address || !formData.mobile || !formData.email) {
  toast.error('Please provide all required (*) information');
  return;
}

    setLoading(true);

    const orderDetails = {
      orderId: `ORDER-${Date.now()}`,
      customerInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.mobile,
        fullAddress: `${formData.address}, ${formData.upazila}, ${formData.district}`,
        comment: formData.comment
      },
      paymentInfo: {
        method: formData.paymentMethod,
        subtotal: subtotal,
        shipping: shippingFee,
        totalAmount: total
      },
      orderItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty || 1,
        unitPrice: item.price,
        lineTotal: item.price * (item.qty || 1)
      }))
    };

    try {
      if (formData.paymentMethod === 'online') {
        const response = await fetch('/api/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDetails),
        });
        const data = await response.json();
        if (data.url) window.location.replace(data.url);
      } else {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDetails),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে (COD)');
          localStorage.removeItem('cart');
          router.push('/order-success');
        } else {
          toast.error('অর্ডার সেভ করতে সমস্যা হয়েছে');
        }
      }
    } catch (error) {
      toast.error('অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে');
      console.error("Order Error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
              <div className="p-6 border-b flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-800">Shipping & Billing</h2>
              </div>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">First Name*</Label>
                      <Input name="firstName" placeholder="First Name*" className="h-12" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Last Name*</Label>
                      <Input name="lastName" placeholder="Last Name*" className="h-12" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Address*</Label>
                    <Input name="address" placeholder="Address*" className="h-12" onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Upazila/Thana*</Label>
                      <Input name="upazila" placeholder="Upazila/Thana*" className="h-12" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">District*</Label>
                      <select
                        name="district"
                        value={formData.district}
                        className="w-full h-12 rounded-md border border-slate-200 px-3 bg-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                        onChange={handleInputChange}
                      >
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">Mobile*</Label>
                      <Input name="mobile" placeholder="Telephone*" className="h-12" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Email*</Label>
                      <Input name="email" type="email" placeholder="E-Mail*" className="h-12" onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Comment</Label>
                    <Textarea name="comment" placeholder="Any special requirement/instruction for us?" className="min-h-[100px]" onChange={handleInputChange} />
                  </div>

                  <div className="pt-4 space-y-4">
                    <Label className="font-bold text-lg">Payment Method</Label>
                    <RadioGroup
                      defaultValue="online"
                      onValueChange={(val) => setFormData(p => ({ ...p, paymentMethod: val }))}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <Label htmlFor="online" className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'online' ? 'border-primary ring-1 ring-primary' : ''}`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="online" id="online" />
                          <span className="font-bold">Online Payment</span>
                        </div>
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      </Label>
                      <Label htmlFor="cod" className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary ring-1 ring-primary' : ''}`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <span className="font-bold">Cash on Delivery</span>
                        </div>
                        <Wallet className="w-5 h-5 text-slate-400" />
                      </Label>
                    </RadioGroup>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden sticky top-28">
              <div className="p-6 border-b bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase">
                  Order Summary
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 truncate max-w-[200px]">{item.name} x {item.qty || 1}</span>
                      <span className="font-bold">৳{(item.price * (item.qty || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Sub-Total:</span>
                    <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Home Delivery:</span>
                    <span className="font-bold text-slate-900">৳{shippingFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-black text-primary">৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    className="w-full h-14 bg-[#3b49bb] hover:bg-[#2e3a9c] text-white text-lg font-bold rounded-md"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Confirm Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}