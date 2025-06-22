
import { useForm } from 'react-hook-form';
import { useFirebaseUsers, User } from '@/hooks/useFirebaseUsers';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'Fleet Admin' | 'Fleet Manager' | 'Driver' | 'Viewer';
  status: 'active' | 'inactive';
}

export function useAddUserForm(onClose: () => void) {
  const { addUser } = useFirebaseUsers();
  const { toast } = useToast();
  
  const form = useForm<AddUserFormData>({
    defaultValues: {
      role: 'Viewer',
      status: 'active'
    }
  });

  const onSubmit = async (data: AddUserFormData) => {
    try {
      // First create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Then add the user to Firestore with the Firebase UID
      const userData: Omit<User, 'id' | 'createdAt'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastLogin: 'Never'
      };
      
      await addUser(userData);
      
      toast({
        title: "User Added Successfully",
        description: `${data.name} has been added with ${data.role} role and can now login with the provided credentials`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = "Failed to add user. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
