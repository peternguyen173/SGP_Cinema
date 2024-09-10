import React, { useEffect, useState } from 'react';
import { getCurrentUserInfo, setNewPassword2 } from '../../api/account';
import Cookies from 'js-cookie';
import './Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = Cookies.get('authToken');
                const data = await getCurrentUserInfo(token);
                setUserInfo(data);
            } catch (error) {
                setError('Lấy thông tin người dùng thất bại');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setPasswordError('Mật khẩu xác nhận không khớp');
            return;
        }
        setPasswordError(null);

        try {
            const token = Cookies.get('authToken');
            await setNewPassword2(token, password);
            setPasswordSuccess('Đổi mật khẩu thành công');
            setPassword('');
            setPasswordConfirmation('');
        } catch (error) {
            setPasswordError('Đổi mật khẩu thất bại');
        }
    };
    const handleCheckboxChange = () => {
        setShowChangePassword(!showChangePassword);
    };
    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile">
            <h1>Hồ sơ Admin</h1>
            <div className="profile-section">
                <h2>Thông Tin Cơ Bản</h2>
                <p><strong>Họ và tên:</strong> {userInfo.fullname}</p>
                <p><strong>Tên đăng nhập:</strong> {userInfo.username}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Địa chỉ:</strong> {userInfo.address}</p>
            </div>
            <div className="profile-section">
                <h2>Chi Tiết Tài Khoản</h2>
                <p><strong>Trạng thái:</strong> {userInfo.status}</p>
                <p><strong>Vai trò:</strong> {userInfo.roles.join(', ')}</p>
                <p><strong>Ngày tạo:</strong> {userInfo.createAt}</p>
            </div>
            <div className="profile-section">
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="change-password-checkbox"
                        checked={showChangePassword}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="change-password-checkbox">Tôi muốn đổi mật khẩu</label>
                </div>
                {showChangePassword && (
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Mật khẩu mới:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới:</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>
                        {passwordError && <p className="error">{passwordError}</p>}
                        {passwordSuccess && <p className="success">{passwordSuccess}</p>}
                        <button type="submit" className="main_button">Đổi Mật Khẩu</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
