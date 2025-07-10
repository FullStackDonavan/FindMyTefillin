// utils/emailTemplates.ts
export const lostReportConfirmation = ({ name, idTag, location, description }: {
  name: string,
  idTag: string,
  location: string,
  description: string,
}) => `
  <div style="font-family: sans-serif;">
    <h2>Hi ${name},</h2>
    <p>We've received your lost tefillin report. Here's what we have:</p>
    <ul>
      <li><strong>ID Tag:</strong> ${idTag}</li>
      <li><strong>Location:</strong> ${location || 'Not provided'}</li>
      <li><strong>Description:</strong> ${description || 'Not provided'}</li>
    </ul>
    <p>We'll notify you as soon as someone reports finding a matching bag.</p>
    <p>Thank you for using FindMyTefillin.com 🙏</p>
  </div>
`


export const foundReportConfirmation = ({ name, idTag, location, description }: {
  name: string,
  idTag: string,
  location: string,
  description: string,
}) => `
  <div style="font-family: sans-serif;">
    <h2>Hi ${name},</h2>
    <p>We've received your found tefillin report. Here's what we have:</p>
    <ul>
      <li><strong>ID Tag:</strong> ${idTag}</li>
      <li><strong>Location:</strong> ${location}</li>
      <li><strong>Description:</strong> ${description}</li>
    </ul>
    <p>Thank you for helping return someone's tefillin! We’ll notify you with any updates.</p>
    <p>Thank you for using FindMyTefillin.com 🙏</p>
  </div>
`

export const registerReportConfirmation = ({
  name,
  idTag,
  description,
}: {
  name: string,
  idTag: string,
  description: string,
}) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>Hi ${name},</h2>
    <p>Thank you for registering your tefillin with us. Here's the information we received:</p>
    <ul>
      <li><strong>ID Tag:</strong> ${idTag}</li>
      <li><strong>Description:</strong> ${description}</li>
    </ul>
    <p>By registering, you're helping us make it easier to recover your tefillin if it's ever lost.</p>
    <p>You’ll receive updates if it's found or matched by someone in our network.</p>
    <p>Thank you for using <strong>FindMyTefillin.com</strong> 🙏</p>
  </div>
`

export const orderConfirmation = ({
  name,
  orderId,
  items,
  total,
}: {
  name: string
  orderId: string
  items: { description: string; quantity: number; price: number }[]
  total: number
}) => `
  <div style="font-family: sans-serif; color: #333;">
    <h2>Hi ${name},</h2>
    <p>Thank you for your order. Here’s a summary of your purchase:</p>

    <h3 style="margin-top: 20px;">🧾 Order #${orderId}</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr>
          <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Item</th>
          <th align="center" style="padding: 8px; border-bottom: 1px solid #ccc;">QTY</th>
          <th align="right" style="padding: 8px; border-bottom: 1px solid #ccc;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
            <td align="center" style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${item.quantity}</strong></td>
            <td align="right" style="padding: 8px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" align="right" style="padding: 8px; border-top: 1px solid #ccc;"><strong>Total:</strong></td>
          <td align="right" style="padding: 8px; border-top: 1px solid #ccc;"><strong>$${total.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>

    <p style="margin-top: 20px;">If you have any questions or need help, reply to this email or contact our team.</p>
    <p>Thank you for using FindMyTefillin.com 🙏</p>
  </div>
`
export const orderShippedConfirmation = ({
  name,
  orderId,
}: {
  name: string
  orderId: number
  trackingNumber: string
  carrier: string
  estimatedDelivery?: string
}) => `
  <div style="font-family: sans-serif; color: #333;">
    <h2>Hi ${name},</h2>
    <p>Your order <strong>#${orderId}</strong> has been shipped! 🎉</p>

    <p>Thank you for using <strong>FindMyTefillin.com</strong> 🙏</p>
  </div>
`
