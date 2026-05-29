import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf9] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif text-[#0c0f0b]">ShreejiAayur</h1>
          </Link>
          <p className="mt-2 text-[#0c0f0b]/70">Premium Ayurvedic Skincare</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#eef5ec] p-8">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-0",
                headerTitle: "text-[#0c0f0b] text-2xl font-serif",
                headerSubtitle: "text-[#0c0f0b]/60",
                socialButtonsBlock: "gap-4",
                socialButtonsBlockButton: "border border-[#81ae74] hover:bg-[#81ae74] hover:text-white text-[#0c0f0b]",
                formFieldLabel: "text-[#0c0f0b]",
                formFieldInput: "border-[#b2997d] focus:border-[#81ae74]",
                formFieldInput_showPasswordButton: "text-[#81ae74]",
                footerActionLink: "text-[#81ae74] hover:text-[#81ae74]/80",
                dividerLine: "bg-[#eef5ec]",
                dividerText: "text-[#0c0f0b]/60",
                identityPreviewText: "text-[#0c0f0b]",
                identityPreviewEditButton: "text-[#81ae74]",
                avatarImage: "border-2 border-[#81ae74]",
                button: "bg-[#81ae74] hover:bg-[#81ae74]/90 text-white",
                modalBackdrop: "bg-[#0c0f0b]/80",
              }
            }}
            forceRedirectUrl="/"
          />
        </div>

        <p className="text-center mt-6 text-sm text-[#0c0f0b]/70">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#81ae74] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
