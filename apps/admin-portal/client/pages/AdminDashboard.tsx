import { useState, useEffect } from "react";
import { Calendar, ChefHat, Plus, Save, LogOut, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MenuEntry {
  _id?: string;
  date: string;
  mealType: string;
  menu: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState("");
  const [menu, setMenu] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuEntries, setMenuEntries] = useState<MenuEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchMenuEntries();
  }, [navigate]);

  const fetchMenuEntries = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/menus", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMenuEntries(data);
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu entries",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingId ? `/api/admin/menus/${editingId}` : "/api/admin/menus";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ date, mealType, menu }),
      });

      if (response.ok) {
        toast({
          title: editingId ? "Menu updated" : "Menu added",
          description: `Menu for ${mealType} on ${date} has been ${editingId ? 'updated' : 'saved'} successfully!`,
        });
        setDate(new Date().toISOString().split('T')[0]);
        setMealType("");
        setMenu("");
        setEditingId(null);
        fetchMenuEntries();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to save menu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: MenuEntry) => {
    setDate(entry.date);
    setMealType(entry.mealType);
    setMenu(entry.menu);
    setEditingId(entry._id || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu entry?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Menu deleted",
          description: "Menu entry has been deleted successfully!",
        });
        fetchMenuEntries();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete menu entry",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const cancelEdit = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setMealType("");
    setMenu("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-mess-gray-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-mess-orange" />
            <h1 className="text-xl font-semibold text-gray-800">ByteBits Admin</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add/Edit Menu Form */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-mess-orange" />
                {editingId ? "Edit Menu" : "Add Today's Menu"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="menu">Menu Items</Label>
                  <Textarea
                    id="menu"
                    placeholder="Enter menu items for today..."
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                    className="min-h-32"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Example: Dal Rice, Sabzi, Roti, Salad, Pickle
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-mess-orange hover:bg-mess-orange-dark text-white"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : editingId ? "Update Menu" : "Save Menu"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Menu Entries */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Recent Menu Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {menuEntries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No menu entries found. Add your first menu!
                  </p>
                ) : (
                  menuEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                          </h4>
                          <p className="text-sm text-gray-600">{entry.date}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(entry)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(entry._id!)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {entry.menu}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
