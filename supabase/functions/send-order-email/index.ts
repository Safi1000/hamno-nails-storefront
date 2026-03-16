import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, address, notes, paymentMethod, items, totalPrice, shippingFee, giftBox, adminEmail } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const htmlItems = items
      .map((i: { name: string; quantity: number; price: number }) => 
        `<tr><td style="padding:12px 8px;border-bottom:1px solid #F2D2D6;color:#4A4A4A;font-size:14px;">${i.name}</td><td style="padding:12px 8px;border-bottom:1px solid #F2D2D6;text-align:center;color:#4A4A4A;font-size:14px;">${i.quantity}</td><td style="padding:12px 8px;border-bottom:1px solid #F2D2D6;text-align:right;color:#7A0D19;font-weight:600;font-size:14px;">Rs. ${i.price * i.quantity}</td></tr>`
      )
      .join("");

    const calculatedTotal = totalPrice + shippingFee + (giftBox || 0);

    const emailHtml = `
      <div style="font-family:'Poppins',Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF6F7;border-radius:24px;padding:40px;border:1px solid #F2D2D6;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#7A0D19;font-family:'Playfair Display',Georgia,serif;font-size:28px;margin-bottom:8px;">New Order Received 💗</h1>
          <p style="color:#9F1C2A;font-size:14px;letter-spacing:1px;text-transform:uppercase;">NailsByHamno Studio</p>
        </div>
        
        <div style="background:white;border-radius:18px;padding:24px;margin-bottom:24px;box-shadow:0 10px 30px rgba(122,13,25,0.05);border:1px solid rgba(242,210,214,0.5);">
          <h2 style="color:#7A0D19;font-size:14px;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;border-bottom:1px solid #F2D2D6;padding-bottom:8px;">Customer Details</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#9F1C2A;font-size:14px;"><strong>Name:</strong></td><td style="padding:4px 0;color:#4A4A4A;font-size:14px;text-align:right;">${name}</td></tr>
            <tr><td style="padding:4px 0;color:#9F1C2A;font-size:14px;"><strong>Email:</strong></td><td style="padding:4px 0;color:#4A4A4A;font-size:14px;text-align:right;">${email}</td></tr>
            <tr><td style="padding:4px 0;color:#9F1C2A;font-size:14px;"><strong>Phone:</strong></td><td style="padding:4px 0;color:#4A4A4A;font-size:14px;text-align:right;">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#9F1C2A;font-size:14px;vertical-align:top;"><strong>Address:</strong></td><td style="padding:8px 0;color:#4A4A4A;font-size:13px;text-align:right;line-height:1.4;">${address}</td></tr>
            ${notes ? `<tr><td style="padding:8px 0;color:#9F1C2A;font-size:14px;vertical-align:top;"><strong>Notes:</strong></td><td style="padding:8px 0;color:#4A4A4A;font-size:13px;text-align:right;font-style:italic;">"${notes}"</td></tr>` : ""}
          </table>
        </div>

        <div style="background:white;border-radius:18px;padding:24px;margin-bottom:24px;box-shadow:0 10px 30px rgba(122,13,25,0.05);border:1px solid rgba(242,210,214,0.5);">
          <h2 style="color:#7A0D19;font-size:14px;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;border-bottom:1px solid #F2D2D6;padding-bottom:8px;">Order Summary</h2>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="color:#7A0D19;font-size:12px;text-transform:uppercase;">
                <th style="padding:8px;text-align:left;border-bottom:2px solid #F2D2D6;">Item</th>
                <th style="padding:8px;text-align:center;border-bottom:2px solid #F2D2D6;">Qty</th>
                <th style="padding:8px;text-align:right;border-bottom:2px solid #F2D2D6;">Price</th>
              </tr>
            </thead>
            <tbody>${htmlItems}</tbody>
          </table>
          
          <div style="margin-top:20px;background:#FFF6F7;border-radius:12px;padding:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#9F1C2A;font-size:14px;">
              <span>Subtotal:</span><span style="float:right;">Rs. ${totalPrice}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#9F1C2A;font-size:14px;">
              <span>Shipping:</span><span style="float:right;">Rs. ${shippingFee}</span>
            </div>
            ${giftBox ? `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#9F1C2A;font-size:14px;">
              <span>Luxury Gift Box:</span><span style="float:right;">Rs. ${giftBox}</span>
            </div>
            ` : ""}
            <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:2px solid #F2D2D6;color:#7A0D19;font-size:20px;font-weight:bold;">
              <span>Total:</span><span style="float:right;">Rs. ${calculatedTotal}</span>
            </div>
          </div>
        </div>
        
        <div style="text-align:center;color:#9F1C2A;font-size:12px;opacity:0.6;">
          <p>Payment Method: ${paymentMethod}</p>
          <p>© 2026 NailsByHamno Studio</p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NailsByHamno <orders@hamnostudio.store>",
        to: [adminEmail || "hamnan03@gmail.com"],
        subject: `✨ New Order — ${name}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
