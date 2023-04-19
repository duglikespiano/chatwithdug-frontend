import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import SignUpValueBox from './SignUpValueBox/SignUpValueBox.jsx';
import Swal from 'sweetalert2';
import NoticeSignUpDataError from './SignUpValueBox/Notice/NoticeSignUpDataError.jsx';

export default function SignUpForm() {
	//------------------------------ regex ------------------------------//
	// 사용자가 입력한 값들의 유효성 검사에 필요한 regular expressions
	const nameRegex = /[a-z0-9_-]{5,15}/;
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;
	const emailRegex = /^[a-zA-Z0-9+-.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

	//------------------------------ function ------------------------------//
	// 자식 component의 변화감지를 위한 function
	const getData = (sort, value) => {
		setValues({
			...values,
			[sort]: value,
		});
	};

	// 이름, 비밀번호, email의 정규식 만족여부를 확인하는 function
	const checkRegexTest = (values) => {
		if (
			nameRegex.test(values.name) === true &&
			passwordRegex.test(values.password) === true &&
			emailRegex.test(values.email) === true
		) {
			return 'goodToGo';
		} else {
			return 'somethingWrong';
		}
	};

	// 사용자의 페이지 새로고침, 닫기 방지를 위한 function
	const preventClose = (event) => {
		event.preventDefault();
		event.returnValue = ''; //Chrome에서 동작하도록; deprecated
	};

	// 사용자의 페이지 뒤로가기 방지를 위한 function
	const preventBack = () => {
		Swal.fire({
			title: 'Want to leave?',
			text: 'You will lose data!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Leave',
		}).then((result) => {
			if (result.isConfirmed) {
				navigate('/');
			} else {
				window.history.pushState(null, '', window.location.href);
			}
		});
	};

	// 회원가입 완료 시 메인페이지로의 redirect를 위한 useNavigate
	const navigate = useNavigate();

	//------------------------------ state ------------------------------//
	// 사용자가 입력한 값들을 저장하는 state
	const [values, setValues] = useState({});

	// 사용자가 입력한 값들의 유효성 만족여부를 확인 및 저장하는 state
	const [showSubmitError, setShowSubmitError] = useState(false);

	//------------------------------ handler ------------------------------//
	// 사용자가 입력한 값들의 유효성 만족여부를 확인 및 저장하는 state의 handler
	// 사용자가 입력한 값들이 유효하지 않다면 유효성 불충족 component를 출력
	const handleShowSubmitError = () => {
		setShowSubmitError((showSubmitError) => true);
	};

	// 사용자가 입력한 값들이 유효한지 검사하는 handler
	const handleSubmit = async (event) => {
		event.preventDefault();
		// 검사 할 대상을 객체형태로 변환
		const fetchData = {
			name: values.name,
			password: values.password,
			passwordCrossCheck: values.passwordCrossCheck,
			email: values.email,
		};
		try {
			// 이름, 비밀번호, email이 정규식에 부합하는지 검사
			if (checkRegexTest(values) === 'somethingWrong') {
				const error = new Error('INVALID FOR REGEX');
				throw error;
			} else if (values.password !== values.passwordCrossCheck) {
				const error = new Error('PASSWORDS NO MATCH');
				throw error;
			} else if (
				values.emailConfirm === false ||
				values.emailConfirm === undefined
			) {
				const error = new Error('INVALID EMAIL');
				throw error;
			}

			// DB에 동일한 이름이 저장되어 있는지 검사
			fetch(
				`${process.env.REACT_APP_BACKEND_URL}/users/signup?sort=name&value=${values.name}`
			)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					if (data?.data.length === 1) {
						throw new Error('DATA ALREADY EXISTS(NAME)');
					}
					return values.email;
				})
				.then((email) => {
					// DB에 동일한 email이 저장되어 있는지 검사
					return fetch(
						`${process.env.REACT_APP_BACKEND_URL}/users/signUp?sort=email&value=${email}`
					);
				})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					if (data?.data.length === 1) {
						throw new Error('DATA ALREADY EXISTS(EMAIL)');
					}
					return fetchData;
				})
				.then((fetchData) => {
					// DB에 저장 요청
					return fetch(`${process.env.REACT_APP_BACKEND_URL}/users/signUp`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(fetchData),
					});
				})
				.then((res) => res.json())
				// --------------서버에서 제대로 저장했다는 응답 있을 시 alert창 띄우기-------------- //
				.then(() => {
					Swal.fire({
						title: 'Signed up!',
						text: 'Hit the OK button to sign in',
						icon: 'success',
					});
				})
				.then(() => {
					navigate('/');
				})
				.catch((error) => {
					// 에러 발생 시, 사용자가 입력한 값들의 유효성 만족여부를 확인 및 저장하는 state를 false로 변경
					// 관련 componenet 출력
					console.error(error);
					handleShowSubmitError();
					Swal.fire({
						title: 'Error!',
						text: 'Please contant to Dug!',
						icon: 'error',
					});
				});
		} catch (error) {
			// 에러 발생 시, 사용자가 입력한 값들의 유효성 만족여부를 확인 및 저장하는 state를 false로 변경
			// 관련 componenet 출력
			console.error(error);
			handleShowSubmitError();
			Swal.fire({
				title: 'Error!',
				text: 'Please contant to Dug!',
				icon: 'error',
			});
		}
	};

	//------------------------------ effect ------------------------------//
	// // 사용자가 페이지를 떠나기 전 확인을 위한 function등록을 위한 useEffect
	useEffect(() => {
		window.addEventListener('beforeunload', preventClose);
		window.addEventListener('popstate', preventBack);
		window.history.pushState(null, '', window.location.href);
		return () => {
			window.removeEventListener('beforeunload', preventClose);
			window.removeEventListener('popstate', preventBack);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div id="signUp">
			<div id="titleBox">Chat With Dug</div>
			<form onSubmit={handleSubmit} id="signUpForm">
				<SignUpValueBox sort={'name'} getData={getData} />
				<SignUpValueBox sort={'password'} getData={getData} />
				<SignUpValueBox sort={'passwordCrossCheck'} getData={getData} />
				<SignUpValueBox sort={'email'} getData={getData} />
				<button type="submit" id="signUpSubmitButton">
					Sign up
				</button>
				{showSubmitError ? <NoticeSignUpDataError /> : null}
			</form>
		</div>
	);
}
