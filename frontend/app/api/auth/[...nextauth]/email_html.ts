/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
export default function email_html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = '#702FF9';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: 'linear-gradient(180deg, #B379FF 0%, #702FF9 100%);',
    buttonBorder: brandColor,
    buttonText: '#fff',
  };

  return `
  <html>
    <head>
      <link href='https://fonts.googleapis.com/css?family=Inter:400,500,600' rel='stylesheet' type='text/css'>
    </head>
    <body style="background: ${color.background}; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: ${color.text};">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: ${color.mainBackground}; max-width: 600px; margin: auto;">
        <tr>
          <td align="center"
            style="font-size: 24px; line-height: 32px; font-weight: 600;">
            Log masuk ke ${escapedHost}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 8px; padding: 10px 14px; border: 1px solid ${color.buttonBorder}; background: ${color.buttonBackground};">
                  <a 
                    href="${url}"
                    target="_blank"
                    style="color: ${color.buttonText}; text-decoration: none; font-weight: 500;"
                  >
                    Log Masuk
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="color: #71717A; font-size: 14px; line-height: 20px;">
            Jika anda tidak membuat permohonan tersebut, sila abaikan emel ini.
          </td>
        </tr>
        <tr>
          <td align="center" style="color: #71717A; font-size: 14px; line-height: 20px;">
            Dijana oleh sistem AskMyGov.
          </td>
      </tr>
      </table>
    </body>
  </html>
  `;
}
