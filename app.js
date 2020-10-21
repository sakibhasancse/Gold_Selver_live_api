const express = require('express')
const app = express()
const request = require('request')
const cheerio = require('cheerio')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path:'.env'})
}


app.get('/api', async(req, res, next) => {

    await request('http://www.livepriceofgold.com/silver-price/india.html', (error, response, html) => {
        if (!error && response.statusCode == 200) {
         
          request('https://www.goldpriceindia.com/bangladesh-gold-price.php', (newerror, newresponse, newhtml) => {

              if (!newerror && newresponse.statusCode == 200) {
                
                    const $$ = cheerio.load(html)
                    const $ = cheerio.load(newhtml)
                  
                    const gold_24gram = $('.panel-body .pad-15').text()
                    const silve_gram_price = $$('.data-table-2 tr:nth-child(3) td:last-child').text()
                    const silve_kg_price = $$('.data-table-2 tr:nth-child(4) td:last-child').text()
                    var new_24gram = gold_24gram.slice(33, 39)
                    var new_22gram = gold_24gram.slice(45, 57)

                  


                    res.status(200).json({

                        silve_kg_price: silve_kg_price,
                        silve_gram_price: silve_gram_price,
                        gold_24_tola: new_24gram,
                        gold_22_tola: new_22gram,
                    })
                }

            }) 
                
        } else {
            res.status(404).json({

               message: 'Not Found'
            })
            }
            
        })
 
   
   

})

app.listen(process.env.PORT,  ()=> {
    console.log('Server is running on ' + process.env.PORT)
})