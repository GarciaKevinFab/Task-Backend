import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

//registro de usuario
export const register = async (req, res) => {
    try {

        //cifrado de contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
        });
        
        await newUser.save();

        res.status(200).json({ success: true, message:'Creado exitosamente'});
    } catch (err) {
        res.status(500).json({ success: false, message:'Error al crear. Intenta de nuevo'});
    }
};

//inicio de sesión de usuario
export const login = async (req, res) => {
    try {
        
        const email = req.body.email;

        const user = await User.findOne({email});
        
        //si el usuario no existe
        if (!user){
            return res.status(404).json({ success: false, message:'Usuario no encontrado'});
        }

        //si el usuario existe, entonces comprueba la contraseña
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        //si la contraseña es incorrecta
        if (!checkCorrectPassword){
            return res.status(401).json({ success: false, message:'Correo electrónico o contraseña incorrecta'});
        }

        const {password, role, ...rest} = user._doc;

        //crear token jwt
        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d"}
        );

        //configurar el token en las cookies del navegador y enviar la respuesta al cliente
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: token.expiresIn
        }).status(200).json({ token, data:{ ...rest}, role});

    } catch (err) {
        res.status(500).json({ success: false, message:'Error al iniciar sesión'});
    }
};
