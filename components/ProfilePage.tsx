import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, WalletIcon, HistoryIcon, UserIcon } from "lucide-react";
import Image from "next/image";

interface Wallet {
  id: number;
  walletId: string;
  balance: number;
  currency: string;
}

interface BackupWallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  amount: number;
  transactionType: string;
  currency: string;
  transactionDate: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  wallets: Wallet[];
  backupWallets: BackupWallet[];
  transactions: Transaction[];
}

const ProfilePage = ({ userEmail }: { userEmail: string }) => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/user/${userEmail}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch user data");

        setProfileData(data);
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !profileData) {
    return <div>{error || "User not found"}</div>;
  }

  return (
    <div className="p-8 bg-zinc-900 text-white rounded-2xl space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {profileData.name ? (
          <div className="w-20 h-20 relative">
            <Image
              src="/assets/3d-2.jpg"
              alt="Profile Picture"
              layout="fill"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <UserIcon className="w-20 h-20 text-gray-400" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{profileData.name}</h2>
          <p className="text-white">{profileData.email}</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="p-6 bg-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          {/* Removed the Edit button */}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-white">Full Name</Label>
            <Input value={profileData.name} readOnly className="text-white" />
          </div>
          <div>
            <Label className="text-white">Email</Label>
            <Input value={profileData.email} readOnly className="text-white" />
          </div>
        </div>
      </Card>

      {/* Wallets */}
      <Card className="p-6 bg-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Wallets</h3>
          <WalletIcon className="w-6 h-6 text-green-500" />
        </div>
        {profileData.wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="flex justify-between items-center p-4 bg-zinc-700 rounded-lg mb-2"
          >
            <div>
              <p className="text-sm text-white">{wallet.currency}</p>
              <p className="text-lg font-semibold text-white">{wallet.balance} {wallet.currency}</p>
            </div>
            <Button size="sm" variant="outline" className="text-white bg-gray-800">
              View
            </Button>
          </div>
        ))}
      </Card>

      {/* Transactions */}
      <Card className="p-6 bg-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <HistoryIcon className="w-6 h-6 text-green-500" />
        </div>

        {profileData.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-zinc-700 rounded-lg">
            <HistoryIcon className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-lg text-gray-400">No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 bg-zinc-700 rounded-lg"
              >
                <div>
                  <p className="text-sm text-white">{transaction.transactionType}</p>
                  <p className="text-lg font-semibold text-white">
                    {transaction.amount} {transaction.currency}
                  </p>
                </div>
                <p className="text-sm text-white">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { email } = context.params;

  const res = await fetch(`${process.env.API_URL}/api/user/${email}`);
  const user = await res.json();

  if (!user) {
    return { notFound: true };
  }

  return {
    props: { userEmail: email },
  };
}

export default ProfilePage;
