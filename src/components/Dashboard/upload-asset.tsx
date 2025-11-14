'use client'

import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Category = { id: number; name: string; createdAt: Date; };
interface UploadDialogProps { categories: Category[] }

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  file: File | null;
}

type CloudinarySignature = { signature: string; timestamp: number; apiKey: string }

export default function UploadAsset({ categories }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    categoryId: "",
    file: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState(prev => ({ ...prev, file }));
  };

  const handleCategoryChange = (value: string) => setFormState(prev => ({ ...prev, categoryId: value }));

  async function getCloudinarySignature(): Promise<CloudinarySignature> {
    const timestamp = Math.round(Date.now() / 1000);
    const res = await fetch("/api/cloudinary/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp })
    });
    if (!res.ok) throw new Error("Failed to generate signature");
    return res.json();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.file) return alert("Please select a file");

    setIsUploading(true);
    setUploadProgressStatus(0);

    try {
      const { signature, apiKey, timestamp } = await getCloudinarySignature();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const data = new FormData();
      data.append("file", formState.file);
      data.append("api_key", apiKey);
      data.append("timestamp", timestamp.toString());
      data.append("signature", signature);
      data.append("folder", "next-full-course-asset-manager");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

      xhr.upload.onprogress = (e) => setUploadProgressStatus(Math.round((e.loaded / e.total) * 100));

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
          else reject(new Error("Cloudinary upload failed"));
        };
        xhr.onerror = () => reject(new Error("Cloudinary upload failed"));
      });

      xhr.send(data);
      const cloudResponse = await uploadPromise;
      console.log("Cloudinary Response:", cloudResponse);

      // TODO: Send `cloudResponse.secure_url` + formState.title/description/categoryId to your DB
      alert("Uploaded Successfully: " + cloudResponse.secure_url);
      setOpen(false);
      setFormState({ title: "", description: "", categoryId: "", file: null });

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgressStatus(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> Upload Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Asset</DialogTitle>
          <DialogDescription>Upload a new image asset to the system.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formState.title} onChange={handleChange} placeholder="Enter title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formState.description} onChange={handleChange} placeholder="Enter description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Picture</Label>
            <Input type="file" id="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formState.categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isUploading && <p>Uploading: {uploadProgressStatus}%</p>}

          <DialogFooter>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
              <Upload className="mr-2 h-5 w-5" /> Upload Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
