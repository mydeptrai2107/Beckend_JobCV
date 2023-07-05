const bcrypt = require("bcrypt");
const authMethod = require('./auth.method');
const jwtVariable = require('../../variables/jwt');
const { SALT_ROUNDS } = require('../../variables/auth');
const db = require("../models");
const Account = db.account;
const User = db.user;
const UserAccount = db.userAccount;
const Company = db.company;
const CompanyAccount = db.companyAccount;

exports.login = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.account_type) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    if (req.body.account_type === 'user') {
        try {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (!account) {
                return res.status(401).send({
                    message: `User not found with email ${req.body.email}.`
                });
            }

            // Find user by account id
            const userAccount = await UserAccount.findOne({ account_id: account.id});
            if (!userAccount) {
                return res.status(401).send({
                    message: `User not found with email ${req.body.email}.`
                });
            }

            // Find user by account id
            const user = await User.findById(userAccount.user_id);
            if (!user) {
                return res.status(401).send({
                    message: `User not found with email ${req.body.email}.`
                });
            }

            // Check password
            const isPasswordValid = bcrypt.compareSync(req.body.password, account.hash_password);
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: `Incorrect password.`
                });
            }

            // create accessToken and refreshToken
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
            const dataForAccessToken = {
                userId: user.id,
                accountId: account.id,
                email: account.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                gender: user.gender,
                avatar: user.avatar,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );
            if (!accessToken) {
                return res.status(500).send({
                    message: `Create token failed.`
                });
            }

            const refreshTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.refreshTokenLife;
            const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.refreshTokenSecret;
            const refreshToken = await authMethod.generateToken(
                dataForAccessToken,
                refreshTokenSecret,
                refreshTokenLife,
            );

            return res.json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                message: "An error occurred while processing your request."
            });
        }
    } else if (req.body.account_type === 'company') {
        try {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (!account) {
                return res.status(401).send({
                    message: `Company not found with email ${req.body.email}.`
                });
            }

            // Find company by account id
            const companyAccount = await CompanyAccount.findOne({ account_id: account.id});
            if (!companyAccount) {
                return res.status(401).send({
                    message: `Company not found with email ${req.body.email}.`
                });
            }

            // Find company by account id
            const company = await Company.findById(companyAccount.company_id);
            if (!company) {
                return res.status(401).send({
                    message: `Company not found with email ${req.body.email}.`
                });
            }

            // Check password
            const isPasswordValid = bcrypt.compareSync(req.body.password, account.hash_password);
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: `Incorrect password.`
                });
            }

            // create accessToken and refreshToken
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
            const dataForAccessToken = {
                CompanyId: company.id,
                accountId: account.id,
                email: account.email,
                name: company.name,
                contact: company.contact,
                info: company.info,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );
            if (!accessToken) {
                return res.status(500).send({
                    message: `Create token failed.`
                });
            }

            const refreshTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.refreshTokenLife;
            const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.refreshTokenSecret;
            const refreshToken = await authMethod.generateToken(
                dataForAccessToken,
                refreshTokenSecret,
                refreshTokenLife,
            );

            return res.json({ accessToken, refreshToken });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                message: "An error occurred while processing your request."
            });
        }
    }
};

exports.register = async (req, res) => {
    // Check if request body is empty
    if (!req.body) {
        return res.status(400).send({ message: "Content can not be empty!" });
    }

    try {
        if (req.body.account_type === 'user') {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (account) {
                const userAccount = await UserAccount.findOne({ account_id: account.id});
                if (userAccount) {
                    return res.status(401).send({
                        message: `User already exists with email ${req.body.email}.`,
                    });
                }
            }

            // Check password confirmation
            if (req.body.password !== req.body.confirm_password) {
                return res.status(400).send({
                    message: "Password confirmation does not match!",
                });
            }

            // Hash password
            const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

            // Create a new user
            const newUser = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone: req.body.phone,
                gender: req.body.gender,
            });
            // Save the new user to the database
            const savedUser = await newUser.save();

            // Create a new account
            const newAccount = new Account({
                email: req.body.email,
                hash_password: hashPassword,
                account_type: req.body.account_type,
            });
            // Save the new account to the database
            const savedAccount = await newAccount.save();

            // Create a new user account
            const newUserAccount = new UserAccount({
                user_id: savedUser.id,
                account_id: savedAccount.id,
            });
            // Save the new user account to the database
            const savedUserAccount = await newUserAccount.save();

            // create accessToken and refreshToken
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
            const dataForAccessToken = {
                userId: savedUser.id,
                accountId: savedAccount.id,
                email: savedAccount.email,
                firstName: savedUser.first_name,
                lastName: savedUser.last_name,
                phone: savedUser.phone,
                gender: savedUser.gender,
                avatar: savedUser.avatar,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );
            if (!accessToken) {
                return res.status(500).send({
                    message: `Create token failed.`
                });
            }

            const refreshTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.refreshTokenLife;
            const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.refreshTokenSecret;
            const refreshToken = await authMethod.generateToken(
                dataForAccessToken,
                refreshTokenSecret,
                refreshTokenLife,
            );

            return res.json({ accessToken, refreshToken });
        } else if (req.body.account_type === 'company') {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (account) {
                const companyAccount = await CompanyAccount.findOne({ account_id: account.id});
                if (companyAccount) {
                    return res.status(401).send({
                        message: `Company already exists with email ${req.body.email}.`,
                    });
                }
            }

            // Check password confirmation
            if (req.body.password !== req.body.confirm_password) {
                return res.status(400).send({
                    message: "Password confirmation does not match!",
                });
            }

            // Hash password
            const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

            // Create a new user
            const newCompany = new Company({
                name: req.body.name,
                contact: req.body.contact,
                info: req.body.info,
            });
            // Save the new user to the database
            const savedCompany = await newCompany.save();

            // Create a new account
            const newAccount = new Account({
                email: req.body.email,
                hash_password: hashPassword,
                account_type: req.body.account_type,
            });
            // Save the new account to the database
            const savedAccount = await newAccount.save();

            // Create a new company account
            const newCompanyAccount = new CompanyAccount({
                company_id: savedCompany.id,
                account_id: savedAccount.id,
            });
            // Save the new user account to the database
            const savedCompanyAccount = await newCompanyAccount.save();

            // create accessToken and refreshToken
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
            const dataForAccessToken = {
                CompanyId: savedCompany.id,
                accountId: savedAccount.id,
                email: savedAccount.email,
                name: savedCompany.name,
                contact: savedCompany.contact,
                info: savedCompany.info,
            };
            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );
            if (!accessToken) {
                return res.status(500).send({
                    message: `Create token failed.`
                });
            }

            const refreshTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.refreshTokenLife;
            const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.refreshTokenSecret;
            const refreshToken = await authMethod.generateToken(
                dataForAccessToken,
                refreshTokenSecret,
                refreshTokenLife,
            );

            return res.json({ accessToken, refreshToken });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "An error occurred while processing your request.",
        });
    }
};

exports.refreshToken = async (req, res) => {
    if (!req.body.account_type) {
        return res.status(400).send({ message: "Account type not found." });
    }
    try {
        // Get refresh token from body
        const refreshTokenFromBody = req.body.refreshToken;
        if (!refreshTokenFromBody) {
            return res.status(400).send('Refresh token not found.');
        }

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || jwtVariable.refreshTokenSecret;

        const decodedRefresh = await authMethod.decodeToken(refreshTokenFromBody, refreshTokenSecret);
        if (!decodedRefresh) {
            return res.status(400).send('Invalid refresh token.');
        }

        const email = decodedRefresh.payload.email;
        var account = await Account.findOne({ email: email });
        var user;
        var userAccount;
        var company;
        var companyAccount;
        if (req.body.account_type === 'user') {
            userAccount = await UserAccount.findOne({ account_id: account.id});
            if (!userAccount) {
                return res.status(401).send({
                    message: `User not found with email ${email}.`,
                });
            }
            user = await User.findById(userAccount.user_id);
            if (!user) {
                return res.status(401).send({
                    message: `User not found with email ${email}.`,
                });
            }
        } else if (req.body.account_type === 'company') {
            companyAccount = await CompanyAccount.findOne({ account_id: account.id});
            if (!companyAccount) {
                return res.status(401).send({
                    message: `Company not found with email ${email}.`,
                });
            }
            company = await Company.findById(companyAccount.company_id);
            if (!company) {
                return res.status(401).send({
                    message: `Company not found with email ${email}.`,
                });
            }
        }

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

        var dataForAccessToken;
        if (user) {
            // Create new access token
            dataForAccessToken = {
                userId: user.id,
                accountId: account.id,
                email: account.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                gender: user.gender,
                avatar: user.avatar,
            };
        } else if (company) {
            dataForAccessToken = {
                CompanyId: company.id,
                accountId: account.id,
                email: account.email,
                name: company.name,
                contact: company.contact,
                info: company.info,
            };
        } else {
            dataForAccessToken = {};
        }

        const accessToken = await authMethod.generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife);
        if (!accessToken) {
            return res.status(400).send('Failed to create access token, please try again.');
        }

        return res.json({
            accessToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'An error occurred while processing your request.',
        });
    }
};

exports.changePass = async (req, res) => {
    try {
        if (req.body.account_type === 'user') {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (!account) {
                const userAccount = await UserAccount.findOne({ account_id: account.id});
                if (userAccount) {
                    return res.status(401).send({
                        message: `User already exists with email ${req.body.email}.`,
                    });
                }
            }

            // Check old password
            const isPasswordValid = bcrypt.compareSync(req.body.oldPassword, account.hash_password);
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: `Incorrect password.`
                });
            }

            // Check password confirmation
            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(400).send({
                    message: "Password confirmation does not match!",
                });
            }

            // Hash password
            const hashPassword = bcrypt.hashSync(req.body.newPassword, SALT_ROUNDS);

            account.hash_password = hashPassword;
            await account.save();

            return res.status(200).send({message: "Success"});
        } else if (req.body.account_type === 'company') {
            // Find account by email
            const account = await Account.findOne({ email: req.body.email });

            if (account) {
                const companyAccount = await CompanyAccount.findOne({ account_id: account.id});
                if (companyAccount) {
                    return res.status(401).send({
                        message: `Company already exists with email ${req.body.email}.`,
                    });
                }
            }

            // Check old password
            const isPasswordValid = bcrypt.compareSync(req.body.oldPassword, account.hash_password);
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: `Incorrect password.`
                });
            }

            // Check password confirmation
            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(400).send({
                    message: "Password confirmation does not match!",
                });
            }

            // Hash password
            const hashPassword = bcrypt.hashSync(req.body.newPassword, SALT_ROUNDS);

            account.hash_password = hashPassword;
            await account.save();

            return res.status(200).send({message: "Success"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: 'An error occurred while processing your request.',
        });
    }
};