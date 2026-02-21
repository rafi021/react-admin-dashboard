import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "motion/react";
import { z } from "zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    console.log(data);
  };
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        className="w-full max-w-md px-4"
      >
        <Card className="w-full bg-white/95 shadow-xl  backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              <CardTitle className="text-2xl font-bold">Register</CardTitle>
              <CardDescription>
                Enter your details below to create a new account
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="name"
                      >
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input hoverEffect"
                          id="name"
                          type="text"
                          placeholder="Your name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="phone"
                      >
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input hoverEffect"
                          id="phone"
                          type="tel"
                          placeholder="Your mobile number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="email"
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input hoverEffect"
                          id="email"
                          type="email"
                          placeholder="Your email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="password"
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input hoverEffect"
                          id="password"
                          type="password"
                          placeholder="*********"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="">
                  <Button
                    type="submit"
                    className="w-full btn hoverEffect"
                    disabled={isLoading}
                  >
                    <UserPlus /> {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-indigo-600 hover:text-indigo-800 hover:underline hoverEffect"
              >
                SignIn
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
