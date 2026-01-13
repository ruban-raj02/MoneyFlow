import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/useAuth";
import OnboardingModal, { OnboardingData } from "@/components/onboarding/OnboardingModal";

const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem(`onboarding_complete_${user?.id}`);
    if (onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    // Save onboarding data
    if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, "true");
      localStorage.setItem(`onboarding_data_${user.id}`, JSON.stringify(data));
    }
    setIsOnboardingComplete(true);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Welcome - MoneyFlow</title>
        <meta name="description" content="Set up your MoneyFlow account" />
      </Helmet>
      <OnboardingModal isOpen={!isOnboardingComplete} onComplete={handleOnboardingComplete} />
    </>
  );
};

export default Onboarding;