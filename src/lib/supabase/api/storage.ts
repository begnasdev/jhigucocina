import { createClient } from "@/lib/supabase/client";

export const uploadImage = async (
  file: File,
  bucket: string,
  restaurantId: string
) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }
  const fileName = `${restaurantId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

export const deleteImage = async (bucket: string, fileName: string) => {
  const supabase = createClient();

  // Extract the path from the URL
  const path = fileName.split(`${bucket}/`)[1];
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
};
