import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/api";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("profile", JSON.stringify(response.profile));

      toast({
        title: "تم تسجيل الدخول بنجاح! ✅",
        description: `مرحباً بك`,
      });

      // Navigate based on user type
      setTimeout(() => {
        if (response.user.user_type === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول ❌",
        description: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور للدخول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <a
                    href="#"
                    className="mr-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ليس لديك حساب؟{" "}
              <a href="/register" className="underline underline-offset-4">
                إنشاء حساب جديد
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
