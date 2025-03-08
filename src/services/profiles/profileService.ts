import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { captureException } from "@/services/monitoring/errorTracking";

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  industry?: string;
  email_verified?: boolean;
  mfa_enabled?: boolean;
  last_sign_in?: string;
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
        captureException(error, { context: 'getUserProfile', userId });
        return null;
      }
      
      // Get MFA status from auth.users.factors
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (!userError && userData) {
        return {
          ...data,
          mfa_enabled: userData.user.factors && userData.user.factors.length > 0,
          email_verified: userData.user.email_confirmed_at !== null
        };
      }
      
      return data;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      captureException(error, { context: 'getUserProfile', userId });
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
        captureException(error, { context: 'updateUserProfile', userId });
        toast.error("Failed to update profile");
        return null;
      }
      
      toast.success("Profile updated successfully");
      return data;
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      captureException(error, { context: 'updateUserProfile', userId });
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
      
      // Optimize image before upload
      const optimizedFile = await this.optimizeImage(file);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, optimizedFile);
        
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        captureException(uploadError, { context: 'updateAvatar', userId });
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
        captureException(updateError, { context: 'updateAvatar', userId });
        toast.error("Failed to update profile with new avatar");
        return null;
      }
      
      toast.success("Avatar updated successfully");
      return publicUrl;
    } catch (error) {
      console.error("Error in updateAvatar:", error);
      captureException(error, { context: 'updateAvatar', userId });
      toast.error("An error occurred while updating your avatar");
      return null;
    }
  }
  
  // Optimize image for upload
  private async optimizeImage(file: File): Promise<File> {
    // If the file is small enough, just return it
    if (file.size < 500 * 1024) { // less than 500KB
      return file;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const maxDimension = 1200;
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          canvas.toBlob((blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file); // Fallback to original if optimization fails
            }
          }, 'image/jpeg', 0.8);
        };
      };
    });
  }
  
  // Update MFA status
  async updateMFAStatus(userId: string, enabled: boolean): Promise<boolean> {
    try {
      // We need to make sure we only update fields that exist in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Ensure we're only updating fields that exist in our table
          // Removing mfa_enabled as it's not in the profiles table schema
          // We'll track MFA status via the auth.users.factors instead
        })
        .eq('id', userId);
      
      if (error) {
        console.error("Error updating profile:", error);
        captureException(error, { context: 'updateMFAStatus', userId });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateMFAStatus:", error);
      captureException(error, { context: 'updateMFAStatus', userId });
      return false;
    }
  }
}

export const profileService = new ProfileService();
