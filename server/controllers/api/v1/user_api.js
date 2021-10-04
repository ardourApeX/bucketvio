const User = require('../../../models/userSchema');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const formidable = require("formidable")

const userApi = {

    register: async (req, res) => {
        let form = formidable.IncomingForm();
        let formData = await new Promise(async (resolve, reject) => {
            await form.parse(req, (formErr, fields, files) => {
                if (formErr) {
                    reject(formErr)
                    return;
                }
                if (fields || files) {
                    resolve({ fields, files })
                    return;
                }
            })
        })

        const { fields: {
            email,
            firstName,
            lastName,
            age,
            gender,
            profileImage,
            street,
            city,
            district,
            state,
            pincode,
            mobileOne,
            mobileTwo,
            password

        }, files } = formData;
        console.log(email)
        try {
            let user = await User.findOne({ "userContact.email": email })
            console.log("user", user)
            if (!user) {
                let hashPassword = await bcrypt.hashSync(password, 10);
                user = await new User({
                    userInfo: {
                        firstName,
                        lastName,
                        age,
                        gender,
                        profileImage,
                    },
                    userContact: {
                        email,
                        mobileOne,
                        mobileTwo,
                    },
                    userAddress: {
                        street,
                        city,
                        district,
                        state,
                        pincode,
                    },
                    password: hashPassword
                });
                console.log(user)
                await user.save()
                return res.status(200).json({ message: "User Resgister successfully", data: { success: true, user } });
            }
            if (user) {
                return res.status(400).json({ message: "User already Resgistered", data: { success: false, user } });

            }


            //             console.log("u", user)
            //             await user.save();
            //             console.log("usersk", user)
            //             const accessToken = await jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
            //             const refreshToken = await jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

            //             res.cookie("refreshToken", refreshToken, {
            //                 sameSite: "strict",
            //                 path: "/api/v1/users/refresh-token",
            //                 expire: 1000 * 60 * 60 * 24 * 7,
            //                 secure: true,
            //                 httpOnly: true,
            //             })
            //             if (accessToken) {
            //                 return res.status(200).json({ message: "User Resgister successfully", data: { success: true, token: accessToken } });
            //             }
            //         }
            //                 // handling if user already in databse 
            //                 else if(user) {
            //         console.log("insdie uuer", user)
            //         return res.status(400).send({ message: "User already registerd", data: { success: false } });
            //     }
            //                 else {
            //         res.status(401).send("invalid authentication");
            //     }
            // });
        } catch (error) {
            console.log("insdie catch")
            res.status(404).json({ data: { success: false, Error: error } });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            // finding the user in database 
            await User.findOne({ 'contact.email': email }, async (err, user) => {
                if (err) { console.log(err); }
                else if (!user) {
                    res.status(404).json({ message: "Please register first", data: { token: null, success: false } });
                }
                // if user found then 
                else if (user) {
                    console.log("found", user)
                    let isMatch = await bcrypt.compare(password, user.encryPassword);
                    if (!isMatch) {
                        return res.status(401).json({ message: "Incorrect Password ", data: { success: false, token: null } });
                    }
                    if (isMatch) {
                        console.log(user._id);
                        const accessToken = await jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
                        const refreshToken = await jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
                        res.cookie("refreshToken", refreshToken, {
                            sameSite: "strict",
                            path: "/api/v1/users/refresh-token",
                            expire: 1000 * 60 * 60 * 24 * 7,
                            httpOnly: true,
                            secure: true,

                        })
                        return res.status(200).json({ message: "Login successully", data: { success: true, token: accessToken } });
                    }
                }
                else {
                    return res.status(404).json({ message: "Invalid Authentication", data: { success: false, token: null } });
                }
            });
        }
        catch (err) {
            if (err) {
                return res.status(404).json({ message: err, data: { success: false, token: null } });
            }
        }
    },
    user: (req, res) => {
        return res.status(200).json(req.user)
    },
    logout: (req, res) => {
        return res.header();
    },
    refreshToken: async (req, res) => {
        try {
            const rf_Token = await req.cookies.refreshToken;
            if (!rf_Token) {
                return res.status(401).json({ data: { success: false, message: "Please Login or Sign Up first" } });
            }
            if (rf_Token) {
                jwt.verify(rf_Token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
                    if (err) {
                        return res.status(401).json({ data: { success: false, message: "Eror Please Login or Sign Up first" } });
                    }
                    if (user) {
                        const accessToken = await jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
                        return res.status(200).json(({ data: { success: true, accessToken: accessToken } }));
                    }
                })
            }
        } catch (error) {
            return res.status(404).send(error)

        }


    }
}

module.exports = userApi;




/*

                    */