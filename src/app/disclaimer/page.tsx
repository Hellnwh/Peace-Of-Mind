import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <section className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Not a Substitute for Professional Help</AlertTitle>
                <AlertDescription>
                    This application is for informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
                </AlertDescription>
            </Alert>
          
          <p>
            PeaceMind provides mental wellness tools and resources designed for support and self-help. The information and tools provided on this website are not intended to be a substitute for professional advice from a qualified medical or mental health provider.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">No Medical Advice</h3>
          <p>
            The content, including text, graphics, images, and information, is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
          </p>

           <h3 className="text-xl font-semibold text-foreground pt-4">Emergency Situations</h3>
          <p>
            If you are experiencing a medical or mental health emergency, or if you are considering or contemplating suicide or feel that you are a danger to yourself or others, you must discontinue use of this application immediately and call your local emergency services number or seek immediate in-person assistance. This app includes features that can connect you to emergency helplines, but we are not a crisis intervention service.
          </p>

          <h3 className="text-xl font-semibold text-foreground pt-4">No Guarantees</h3>
          <p>
            While we strive to provide helpful and accurate information, we make no representation and assume no responsibility for the accuracy of information on or available through this website. You are encouraged to confirm any information obtained from or through this website with other sources, and review all information regarding any medical condition or treatment with your physician.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
