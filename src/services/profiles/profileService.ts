
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  industry?: string;
}

class ProfileService {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user profile:", error);
        toast.error("Failed to update profile");
        return null;
      }
      
      toast.success("Profile updated successfully");
      return data;
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      toast.error("An error occurred while updating your profile");
      return null;
    }
  }

  // Update avatar
  async updateAvatar(userId: string, file: File): Promise<string | null> {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        toast.error("Failed to upload avatar");
        return null;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      
      if (updateError) {
        console.error("Error updating profile with avatar:", updateError);
        toast.error("Failed to update profile with new avatar");
        return null;
      }
      
      toast.success("Avatar updated successfully");
      return publicUrl;
    } catch (error) {
      console.error("Error in updateAvatar:", error);
      toast.error("An error occurred while updating your avatar");
      return null;
    }
  }
}

export const profileService = new ProfileService();
