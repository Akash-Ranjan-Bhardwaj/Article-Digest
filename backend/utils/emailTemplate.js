
module.exports.resetPasswordTemplate = (username , resetLink)=>{
    return`
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {
            font-family: Arial, sans-serif; 
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #2563eb;
                color: white!important;
                text-decoration: none;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Hi ${username},</h2>
            <p>You requested a password reset. Click the button below:</p>
            <a href="${resetLink}" class="button">Reset Password </a>
            <p>This link expires in 15 minutes.</p>
        </div>
    </body>
    </html>
    `;
};