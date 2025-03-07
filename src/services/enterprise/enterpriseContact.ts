
import { supabase } from "@/integrations/supabase/client";

interface EnterpriseContactRequest {
  name: string;
  email: string;
  company: string;
  message: string;
}

class EnterpriseService {
  async submitContactRequest(request: EnterpriseContactRequest): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Call the Enterprise Contact edge function
      const { data, error } = await supabase.functions.invoke('enterprise-contact', {
        body: {
          name: request.name,
          email: request.email,
          company: request.company,
          message: request.message,
          userId: user.user?.id || null
        }
      });
      
      if (error) {
        console.error("Error submitting enterprise contact request:", error);
        return false;
      }
      
      return data?.success || false;
    } catch (error) {
      console.error("Error in submitContactRequest:", error);
      return false;
    }
  }
}

export const enterpriseService = new EnterpriseService();
