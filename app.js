require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static(__dirname+"\\public"));
app.use(express.json());
app.set('view engine', 'ejs');

const port = process.env.PORT;
const api_key = process.env.OPENAI_API_KEY;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: api_key,
});

let history = [];

const openai = new OpenAIApi(configuration);

app.get('/', (req,res)=>{
    res.render("index.ejs");
});

app.get('/ask', async (req,res)=>{
    const { question }= req.query;


    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
            {role: 'user', content: `${question}`},
        ],
    });

    const answer = response.data.choices[0].message.content;
    history.push({question,answer});
    res.render('index2.ejs', {data: history});
});

app.get('/clear', (req,res)=>{
    history = [];
    res.render('index.ejs');
});

app.listen(port, ()=>{
    console.log(`App working on http://127.0.0.1:${port}`);
})