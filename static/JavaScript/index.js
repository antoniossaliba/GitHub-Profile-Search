import express, { response } from "express"
import { dirname } from "path"
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app       = express();
const PORT      = 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    res.sendFile(__dirname.substring(0, 75) + "\\templates\\index.html");

});

app.post("/", (req, res) => {

    const username = req.body.username;

    const URL = `https://api.github.com/users/${username}`;

    const request = new Request(URL, { headers: { "accept": "application/vnd.github+json" } });

    fetch(request)
    .then(response => {

        if (!response.ok) {

            throw new Error("Network error!");

        }

        return response.json();

    })
    .then(data => {

        console.log(data);
        res.render(__dirname.substring(0, 75) + "\\templates\\result.ejs", { name: data.name, username: data.login,
                                                                        avatar_url: data.avatar_url, url: data.html_url,
                                                                        repos_url: data.repos_url, company: data.company,
                                                                        loc: data.location, bio: data.bio, public_repos: data.public_repos });

    })
    .catch(error => {

        console.log(error);

    });

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});