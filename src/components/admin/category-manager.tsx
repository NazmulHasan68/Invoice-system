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
        const newCategory: Category = {
          id: Math.max(0, ...categories.map((c) => c.id)) + 1,
          name: newCategoryName,
          createdAt: new Date(),
        };

        setCategories([...categories, newCategory]);
        setNewCategoryName('');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlleDeleteCategory = async(currentCategoryIdToDelete: number) => {
    const result = await deleteCategoryActions(currentCategoryIdToDelete)

    if(result.success){
        setCategories(categories.filter(c=>c.id !== currentCategoryIdToDelete))
    }
  }
  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNewCategory} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="categoryName" className="text-sm font-medium py-2">
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
        </div>
      </form>

      <div>
        <h3 className="text-md font-medium mb-4">Categories</h3>
        {categories.length === 0 ? (
          <p>No categories added yet. Add your first category above.</p>
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
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button onClick={()=> handlleDeleteCategory(cat.id)} variant="ghost" size="icon">
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
