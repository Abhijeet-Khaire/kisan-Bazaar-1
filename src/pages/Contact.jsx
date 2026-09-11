import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Message Sent",
                description: "We'll get back to you within 24 hours.",
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-12">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h1 className="font-serif text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            Have questions or need assistance? Our support team is here to help you grow.
                        </p>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Call Us</p>
                                        <p className="text-muted-foreground">+91 8432484017 (Mon-Sat, 9am-6pm)</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email Us</p>
                                        <p className="text-muted-foreground">support@kisanbazaar.in</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Visit Us</p>
                                        <p className="text-muted-foreground">Krishi Bhawan, Paranda, India - 413502</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input required placeholder="Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input required placeholder="Surname" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input required type="email" placeholder="abc@gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input required placeholder="How can we help?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea required placeholder="Tell us more about your query..." className="min-h-[150px]" />
                                </div>
                                <Button type="submit" className="w-full gap-2" disabled={loading}>
                                    <Send className="h-4 w-4" />
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
