import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { Building2, Users, Handshake, CheckCircle2, ShieldCheck, ArrowRight, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
    const { toast } = useToast();
    const { factoryContracts, joinContractPool } = useGlobalState();
    const { user } = useAuth();

    const [selectedContract, setSelectedContract] = useState(null);
    const [commitQuantity, setCommitQuantity] = useState("");
    const [forumPosts, setForumPosts] = useState([
        { id: 1, author: "Dr. Ramesh Agrotech", role: "Factory Agronomist", topic: "Optimal FL-2027 Potato seed spacing for PepsiCo contract", time: "2 hours ago", replies: 14 },
        { id: 2, author: "Gurpreet S. (Farmer Lead)", role: "Pool Coordinator", topic: "Ludhiana Cluster: Combining 120 Tons for joint truck shipment", time: "5 hours ago", replies: 8 }
    ]);
    const [newTopic, setNewTopic] = useState("");

    const handleJoinPool = (contractId) => {
        const qty = Number(commitQuantity);
        if (!qty || qty <= 0) {
            toast({
                title: "Invalid Quantity",
                description: "Please enter a valid tonnage to commit.",
                variant: "destructive",
            });
            return;
        }

        joinContractPool(contractId, qty);
        toast({
            title: "Successfully Joined Harvest Pool!",
            description: `You committed ${qty} Quintals to the contract pool. Factory team notified.`,
        });
        setSelectedContract(null);
        setCommitQuantity("");
    };

    const handlePostTopic = (e) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        setForumPosts(prev => [
            {
                id: Date.now(),
                author: user?.name || "Farmer Member",
                role: "Farmer",
                topic: newTopic,
                time: "Just now",
                replies: 0
            },
            ...prev
        ]);
        setNewTopic("");
        toast({
            title: "Discussion Topic Posted",
            description: "Your query is live in the farmer-factory community forum.",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Farmer-Factory Contract Community</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Direct contract farming & collective harvesting pools between local farmers and major food processing factories.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Active Factory Contracts */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold font-serif flex items-center gap-2">
                            <Handshake className="h-5 w-5 text-primary" /> Active Factory Procurement Pools
                        </h2>

                        <div className="space-y-4">
                            {factoryContracts.map((contract) => (
                                <Card key={contract.id} className="hover:border-primary transition-colors">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge variant="outline" className="mb-1 border-primary text-primary font-semibold">
                                                    {contract.factoryName}
                                                </Badge>
                                                <CardTitle className="text-xl">{contract.cropTarget}</CardTitle>
                                                <CardDescription className="text-xs">{contract.location} • Window: {contract.harvestWindow}</CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-muted-foreground block">Guaranteed Price</span>
                                                <span className="text-xl font-bold text-primary">₹{contract.guaranteedPrice.toLocaleString()} / {contract.unit}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <p className="text-muted-foreground text-xs">{contract.description}</p>

                                        {/* Progress bar for target quantity */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Pool Progress: {contract.committedQuantity} / {contract.targetQuantity} {contract.unit}</span>
                                                <span>{Math.round((contract.committedQuantity / contract.targetQuantity) * 100)}% Fulfilled</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${Math.min(100, (contract.committedQuantity / contract.targetQuantity) * 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-lg bg-muted/40">
                                            <div>
                                                <span className="text-muted-foreground block">Joined Farmers</span>
                                                <span className="font-semibold">{contract.joinedFarmers} Farmers</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block">Min Commitment</span>
                                                <span className="font-semibold">{contract.minFarmerCommitment} {contract.unit}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block">Advance Pay</span>
                                                <span className="font-semibold text-green-600">{contract.advancePaymentPercent}% Upfront</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block">Quality Req</span>
                                                <span className="font-semibold text-blue-600">{contract.requiredMoisture}</span>
                                            </div>
                                        </div>

                                        {selectedContract === contract.id ? (
                                            <div className="p-3 border rounded-md space-y-3 bg-card">
                                                <label className="text-xs font-semibold block">Enter Tonnage to Commit (Min: {contract.minFarmerCommitment} {contract.unit})</label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="e.g. 50"
                                                        value={commitQuantity}
                                                        onChange={(e) => setCommitQuantity(e.target.value)}
                                                    />
                                                    <Button onClick={() => handleJoinPool(contract.id)}>Confirm Join</Button>
                                                    <Button variant="ghost" onClick={() => setSelectedContract(null)}>Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button className="w-full gap-2" onClick={() => setSelectedContract(contract.id)}>
                                                <Users className="h-4 w-4" /> Join Collective Harvest Pool
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Community Discussion Forum */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    <CardTitle>Factory & Agronomist Forum</CardTitle>
                                </div>
                                <CardDescription>Connect with factory managers & fellow farmers</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={handlePostTopic} className="space-y-2">
                                    <Input
                                        placeholder="Ask factory agronomist a question..."
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                    />
                                    <Button type="submit" size="sm" className="w-full gap-1">
                                        <PlusCircle className="h-4 w-4" /> Post Topic
                                    </Button>
                                </form>

                                <div className="space-y-3 pt-2">
                                    {forumPosts.map((post) => (
                                        <div key={post.id} className="p-3 rounded-lg border bg-card text-xs space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-primary">{post.author}</span>
                                                <span className="text-[10px] text-muted-foreground">{post.time}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] py-0">{post.role}</Badge>
                                            <p className="font-medium text-foreground pt-1">{post.topic}</p>
                                            <div className="text-[11px] text-muted-foreground pt-1 flex justify-between border-t border-muted/50">
                                                <span>{post.replies} replies</span>
                                                <span className="text-primary hover:underline cursor-pointer">Join Discussion →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
