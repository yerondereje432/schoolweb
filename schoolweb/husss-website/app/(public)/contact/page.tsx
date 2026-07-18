import { createClient } from "@/lib/supabase/server";
import PageHero from "@/components/public/page-hero";
import ContactForm from "@/components/public/contact-form";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import ScrollReveal3D, { StaggeredReveal } from "@/components/public/animations/ScrollReveal3D";
import ParallaxCard from "@/components/public/animations/ParallaxCard";
import FloatingParticles, { GreenGeometric } from "@/components/public/animations/FloatingParticles";
import MagneticButton from "@/components/public/animations/MagneticButton";
import ThreeDBackground from "@/components/public/animations/ThreeDBackground";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: contact } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .single();

  const hasMap = contact?.map_lat && contact?.map_lng;

  return (
    <div className="relative">
      {/* Subtle geometric background */}
      <GreenGeometric count={10} className="opacity-20" />

      <PageHero
        icon={<Mail size={28} />}
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you — reach out with any questions."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        {/* Contact Info */}
        <div>
          <ScrollReveal3D type="slide-up-3d">
            <h2 className="text-lg font-semibold text-husss-green-950 mb-6">Get in Touch</h2>
          </ScrollReveal3D>

          <StaggeredReveal staggerDelay={100}>
            <ScrollReveal3D type="fade-up">
              <ParallaxCard className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all duration-500 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-husss-green-100 flex items-center justify-center shrink-0">
                    <MapPin className="text-husss-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-husss-green-950">Visit Us</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {contact?.address_en || "Address to be added by school administration."}
                    </p>
                  </div>
                </div>
              </ParallaxCard>
            </ScrollReveal3D>

            <ScrollReveal3D type="fade-up" delay={100}>
              <ParallaxCard className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all duration-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-husss-gold-100 flex items-center justify-center shrink-0">
                    <Phone className="text-husss-gold-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-husss-green-950">Call Us</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {contact?.phone_primary || "Phone to be added"}
                      {contact?.phone_secondary ? ", " + contact.phone_secondary : ""}
                    </p>
                  </div>
                </div>
              </ParallaxCard>
            </ScrollReveal3D>

            <ScrollReveal3D type="fade-up" delay={200}>
              <ParallaxCard className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all duration-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-husss-green-100 flex items-center justify-center shrink-0">
                    <Mail className="text-husss-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-husss-green-950">Email Us</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {contact?.email_primary || "Email to be added"}
                    </p>
                  </div>
                </div>
              </ParallaxCard>
            </ScrollReveal3D>

            {!contact?.address_en && !contact?.phone_primary && !contact?.email_primary && (
              <ScrollReveal3D type="fade-up" delay={300}>
                <div className="bg-husss-gold-50 border border-husss-gold-200 rounded-xl p-6 text-center">
                  <Mail className="mx-auto text-husss-gold-400 mb-3" size={32} />
                  <p className="text-sm text-husss-gold-700 italic">
                    Contact details will appear here once added by school administration.
                  </p>
                </div>
              </ScrollReveal3D>
            )}

            {hasMap && (
              <ScrollReveal3D type="slide-up-3d" delay={400}>
                <div className="rounded-xl overflow-hidden border border-gray-100 aspect-video mt-6">
                  <iframe
                    title="School location"
                    className="w-full h-full"
                    loading="lazy"
                    src={"https://www.google.com/maps?q=" + contact!.map_lat + "," + contact!.map_lng + "&z=15&output=embed"}
                  />
                </div>
              </ScrollReveal3D>
            )}
          </StaggeredReveal>
        </div>

        {/* Contact Form */}
        <div>
          <ScrollReveal3D type="slide-up-3d">
            <h2 className="text-lg font-semibold text-husss-green-950 mb-6">Send a Message</h2>
          </ScrollReveal3D>

          <ScrollReveal3D type="fade-up" delay={100}>
            <ParallaxCard
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-xl transition-all duration-500"
              glow
              glowColor="rgba(245, 168, 0, 0.3)"
            >
              <ContactForm />
            </ParallaxCard>
          </ScrollReveal3D>

          {/* Quick actions */}
          <ScrollReveal3D type="fade-up" delay={200}>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <MagneticButton
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => window.open("tel:" + (contact?.phone_primary || ""), "_self")}
              >
                <Phone size={18} /> Call Now
              </MagneticButton>
              <MagneticButton
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => window.open("mailto:" + (contact?.email_primary || ""), "_self")}
              >
                <Mail size={18} /> Email Us
              </MagneticButton>
            </div>
          </ScrollReveal3D>
        </div>
      </div>
    </div>
  );
}
