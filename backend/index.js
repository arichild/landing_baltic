import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import 'dotenv/config'

const app = express()
const port = 4400

app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(cors())

app.use(cors({
  origin: process.env.CLIENT_URI,
  credentials: true,
}))

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendMail = (mailData) => {
  const {tourName, tourPrice, email, phone, company, name, subject, message} = mailData
  const tourInfo = tourName && tourPrice ? `Вы получили новую заявку на тур: <strong>${tourName}</strong> по цене <strong>${tourPrice}</strong>.` : 'Вы получили новую заявку.';

  const html = `
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="font-family: Arial, sans-serif; color: #333;">📩 Новая заявка</h2>
    <p style="font-family: Arial, sans-serif; color: #777;">${tourInfo}</p>
  </div>
  <table style="border-collapse: collapse; width: 100%; max-width: 610px; margin: 0 auto; background-color: #fff;">
    <tbody>
      <tr>
        <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Параметр</th>
        <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Значение</th>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Имя</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Номер телефона</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${phone}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Электронный ящик</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Компания</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${company}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ccc;">Сообщение</td>
        <td style="padding: 10px; border: 1px solid #ccc;">${message}</td>
      </tr>
    </tbody>
  </table>
  `;

  return new Promise((resolve, reject) =>{
    transport.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: html,
    }, function(error, info){
      if (error) {
        console.log(error)
        resolve({
          error: true,
          message: 'Сообщение не отправлено',
          errorData: error
        })
      } else {
        resolve({
          error: false,
          message: 'Сообщение отправлено',
        })
      }
    })
  })
}

app.post('/send-mail', async (req, res) => {
  try {
    const mailData = req.body.mailData

    if (!mailData || typeof mailData !== 'object') {
      res.json({
        error: true,
        message: "Не переданы необходимые для отправки почты данные"
      })
    }

    const resp = await sendMail(mailData)

    res.json({
      ...resp
    })
  } catch (e) {
    console.log(e)

    res.json({
      error: true,
      message: "При отправке почты произошла непредвиденная ошибка"
    })
  }
})

app.listen(port, () => {
  console.log(` http://localhost:${4400}/`)
})