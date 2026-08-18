const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;
        let user = await UserModel.findOne({ email: email });

        if (!user) {
            user = new UserModel({
                name,
                email,
                photoUrl
            });
            await user.save();
        }

        return res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}