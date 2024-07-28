import express from "express";
import axios from "axios";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/ISS", async(req,res)=>{
    try {
        console.log("ISS working")
        const location= await axios.get("https://api.wheretheiss.at/v1/satellites/25544");
        let lat=18.517327 /*location.data.latitude;*/
        let lon= 73.815280/*location.data.longitude;*/
        const image=await axios.get(`https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=2022-01-01&dim=0.3&api_key=lMkazLxYCNhRAJFxorPcGeS3ObgGnHkzh08WfrPk`,{
            responseType:'arraybuffer'
        });
        const imageBase64 = Buffer.from(image.data, 'binary').toString('base64');
        res.render("index.ejs",{latitude:lat,longitude:lon,SatImg:imageBase64})
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
})

app.post("/curosity",async(req,res)=>{
    try {
        console.log("curosity working")
        const result=await axios.get("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2024-01-01&camera=fhaz&api_key=lMkazLxYCNhRAJFxorPcGeS3ObgGnHkzh08WfrPk");
        let imglink=result.data.photos[0].img_src
        const image=await axios.get(imglink,{
            responseType:'arraybuffer'
        });
        const imageBase64 = Buffer.from(image.data, 'binary').toString('base64');
        res.render("index.ejs",{MarsImg:imageBase64})
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

