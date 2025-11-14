'use client'

import { addNewCategoryAction, deleteCategoryActions } from "@/actions/Admin-actions";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";

type Category = {
  id: number;
  name: string;
  createdAt: Date;
};

interface CategoryManagerProps {
  categories: Category[];
}

export default function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddNewCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCategoryName);

      const result = await addNewCategoryAction(formData);

      if (result.success) {
        window.location.reload(); // Revalidate and refresh
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const result = await deleteCategoryActions(id);
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Add Category */}
      <form onSubmit={handleAddNewCategory} className="space-y-4">
        <label htmlFor="categoryName" className="text-sm font-medium">
          New Category
        </label>
        <div className="flex gap-2">
          <input
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter category name"
          />
          <button
            type="submit"
            className="flex items-center bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md"
          >
            <Plus className="h-4 w-4 mr-2" /> Add
          </button>
        </div>
      </form>

      {/* Category Table */}
      <div>
        <h3 className="text-md font-medium mb-4">Categories</h3>
        {categories.length === 0 ? (
          <p>No categories added yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteCategory(cat.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
