
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Organization, CreateOrganizationData } from '@/types/organization';

export class OrganizationService {
  static async createOrganization(orgData: CreateOrganizationData, userId: string, userEmail: string): Promise<string> {
    console.log('Creating organization:', orgData);
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial

    const docRef = await addDoc(collection(db, 'organizations'), {
      ...orgData,
      ownerId: userId,
      ownerEmail: userEmail,
      createdAt: new Date(),
      trialEndsAt,
    });
    
    console.log('Organization created successfully with ID:', docRef.id);
    return docRef.id;
  }

  static async updateOrganization(id: string, orgData: Partial<Organization>): Promise<void> {
    await updateDoc(doc(db, 'organizations', id), orgData);
  }

  static async deleteOrganization(id: string): Promise<void> {
    await deleteDoc(doc(db, 'organizations', id));
  }

  static subscribeToUserOrganizations(
    userId: string,
    onSnapshot: (organizations: Organization[]) => void,
    onError: (error: any) => void
  ): () => void {
    console.log('Setting up Firestore listener for user:', userId);
    
    // Use simpler query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'organizations'), 
      where('ownerId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Firestore snapshot received, docs count:', snapshot.docs.length);
      
      const orgsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        trialEndsAt: doc.data().trialEndsAt?.toDate(),
        subscriptionEndsAt: doc.data().subscriptionEndsAt?.toDate(),
      })) as Organization[];
      
      // Sort by createdAt in JavaScript instead of using Firestore orderBy
      orgsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('Processed organizations:', orgsData);
      onSnapshot(orgsData);
    }, onError);

    return unsubscribe;
  }
}
