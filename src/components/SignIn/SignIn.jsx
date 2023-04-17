import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './SignIn.css';

export default function SignIn() {
	const nameRegex = /[a-z0-9_-]{5,15}/;
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

	const checkRegexTest = (values) => {
		if (
			nameRegex.test(values.name) === true &&
			passwordRegex.test(values.password) === true
		) {
			return 'goodToGo';
		} else {
			return 'somethingWrong';
		}
	};

	const navigate = useNavigate();
	const inputName = useRef();
	const inputPassword = useRef();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const fetchData = {
			name: inputName.current.value,
			password: inputPassword.current.value,
		};
		try {
			if (checkRegexTest(fetchData) === 'somethingWrong') {
				const error = new Error('정규식 위반');
				throw error;
			}
			fetch(
				`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/users/signin`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(fetchData),
				}
			)
				.then((res) => res.json())
				.then((data) => {
					sessionStorage.setItem('token', data.data.token);
					sessionStorage.setItem('name', data.data.name);
					sessionStorage.setItem('email', data.data.email);
				})
				.then(() => {
					navigate('/lobby');
				})
				.catch((error) => {
					console.error(error);
					Swal.fire('Invalid Input', 'Please Check Input Values', 'warning');
				});
		} catch (error) {
			console.error(error);
			Swal.fire('Invalid Input', 'Please Check Input Values', 'warning');
		}
	};

	useEffect(() => {
		sessionStorage.clear();
	}, []);

	return (
		<div id="SignIn">
			<div id="titleBox">Chat With Dug</div>
			<form onSubmit={handleSubmit}>
				<div className="wrapper">
					<input
						ref={inputName}
						className="signInValueInputBox"
						placeholder="Username"
						name="name"
						maxLength="15"
					/>
				</div>
				<div className="wrapper">
					<input
						ref={inputPassword}
						className="signInValueInputBox"
						placeholder="Password"
						name="password"
						maxLength="16"
					/>
				</div>
				<div className="wrapper">
					<button id="signInButton">Sign in</button>
				</div>
			</form>
			<div className="wrapper">
				<button id="passwordRecoverButton" onClick={() => {}}>
					Forgot Password?
				</button>
				<button
					id="signUpButton"
					onClick={() => {
						navigate('/signup');
					}}
				>
					Sign up
				</button>
			</div>
		</div>
	);
}
