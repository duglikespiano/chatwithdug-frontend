import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeValidateCodeSent from '../SignUp/SignUpValueBox/Notice/NoticeValidateCodeSent.jsx';
import NoticeValidateCodeCheckResult from '../SignUp/SignUpValueBox/Notice/NoticeValidateCodeCheckResult.jsx';
import NoticeEmptyInputValue from '../SignUp/SignUpValueBox/Notice/NoticeEmptyInputValue.jsx';
import NoticeInvalidInputValue from '../SignUp/SignUpValueBox/Notice/NoticeInvalidInputValue.jsx';
import './ResetPassword.css';
import Swal from 'sweetalert2';

export default function ResetPassword() {
	const navigate = useNavigate();
	const passwordRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

	// 사용자가 입력한 값들을 저장하는 state
	const [values, setValues] = useState({});
	const [emailInputBoxToggle, setEmailInputBoxToggle] = useState(true);
	const [checkDataExists, setCheckDataExists] = useState(false);

	//------------------------------ ref ------------------------------//
	// 사용자가 입력하는 email input 감지를 위한 useRef
	const emailInputBox = useRef();

	// 사용자가 입력하는 email validate code 감지를 위한 useRef
	const emailValidateCheckInputBox = useRef();

	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state
	const [validateCodeBoxToggle, setValidateCodeBoxToggle] = useState(false);

	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state
	// 사용자가 인증코드를 입력 후, 확인버튼을 누르면 인증코드의 input box가 비활성화 됨
	const [validateCodeInputBoxToggle, setValidateCodeInputBoxToggle] =
		useState(false);

	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state
	const [validateCodeMatchCheck, setValidateCodeMatchCheck] = useState(false);

	// 사용자의 focus가 있었는지 여부를 저장하는 state
	const [touched, setTouched] = useState({});

	// 사용자의 입력한 값이 정규식을 만족하는지 저장하는 state
	const [regexTest, setRegexTest] = useState({});

	// 사용자의 focus가 있었는지 여부를 저장하는 state의 hanlder
	const handleValueTouched = (event) => {
		if (touched[event.target.name] === undefined) {
			setTouched({
				...touched,
				[event.target.name]: true,
			});
		}
	};

	// email인증코드 발송관련 html 중 email의 input box disabled 여부를 저장하는 state의 handler
	const handleEmailInputBoxToggle = () => {
		setEmailInputBoxToggle(
			(emailInputBoxToggle) => (emailInputBoxToggle = !emailInputBoxToggle)
		);
	};

	// email인증코드 발송관련 html 전체 토글 상태를 저장하는 state의 handler
	const handleEmailValidateCodeBoxToggle = () => {
		setValidateCodeBoxToggle(
			(emailValidateCodeBoxToggle) =>
				(emailValidateCodeBoxToggle = !emailValidateCodeBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email 인증코드의 input box의 disabled 여부를 저장하는 state의 handler
	const handleSetEmailValidateInputBoxToggle = () => {
		setValidateCodeInputBoxToggle(
			(emailValidateCheckInputBoxToggle) =>
				(emailValidateCheckInputBoxToggle = !emailValidateCheckInputBoxToggle)
		);
	};

	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state
	// 사용자가 입력한 인증코드가 6자리가 될 경우에만 인증코드일치 확인요청 버튼이 활성화 됨
	const [validateCodeInputCheck, setValidateCodeInputCheck] = useState(false);

	// email인증코드 발송관련 html 중 email 인증코드일치 확인요청 버튼의 disabled 여부를 저장하는 state의 handler
	const handleValidateCodeInputCheck = () => {
		if (emailValidateCheckInputBox.current.value.trim().length === 6) {
			setValidateCodeInputCheck(
				(validateCodeInputCheck) => (validateCodeInputCheck = true)
			);
		} else {
			setValidateCodeInputCheck(
				(validateCodeInputCheck) => (validateCodeInputCheck = false)
			);
		}
	};

	// 사용자가 인증코드를 입력 후 확인 버튼을 눌렀는지 확인 하는 state
	const [checkSumbitValidateCode, setCheckSubmitValidateCode] = useState(false);

	// 사용자가 입력한 인증코드가 옳든 그르든 우선 입력 후에는 true로 전환
	const handleSetCheckSubmitValidateCode = () => {
		setCheckSubmitValidateCode(
			(checkSumbitValidateCode) =>
				(checkSumbitValidateCode = !checkSumbitValidateCode)
		);
	};

	// 사용자가 입력한 email 인증코드일치 여부를 저장하는 state의 hanlder
	// 사용자가 인증코드를 기입 및 전송 후 새로운 email을 적용하기 위해 취소 버튼을 누를 시, 해당상태를 초기화
	const handleValidateCodeMatchCheck = () => {
		setValidateCodeMatchCheck(
			(validateCodeMatchCheck) => (validateCodeMatchCheck = false)
		);
	};

	const handleResetValidateCodeInputCheck = () => {
		setValidateCodeInputCheck(
			(validateCodeInputCheck) => (validateCodeInputCheck = false)
		);
	};

	// 사용자의 입력한 값이 정규식을 만족하는지 저장하는 state의 handler
	const handleSetRegexTest = (event) => {
		setRegexTest({
			...regexTest,
			[event.target.name]: passwordRegex.test(event.target.value),
		});
	};

	// 사용자가 입력한 값들을 저장하는 state의 handler
	const handleValue = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	// 사용자가 입력한 ID와 email이 DB에 이미 저장되어 있는지 DB에 확인 요청하는 fetch
	const fetchData = (sort, value) => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/users/signup?sort=${sort}&value=${value}`
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.data.length === 0) {
					setCheckDataExists((checkDataExists) => (checkDataExists = false));
				} else {
					setCheckDataExists((checkDataExists) => (checkDataExists = true));
				}
			});
	};

	// 사용자가 입력한 email로 인증코드를 요청하는 fetch
	// 호출 시 서버에서 사용자에게 메일을 발송
	const requestValidateCode = () => {
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/validatecode?email=${emailInputBox.current.value}`
		)
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
	};

	const checkValidateCode = () => {
		const fetchData = {
			email: emailInputBox.current.value,
			validateCode: emailValidateCheckInputBox.current.value,
		};

		fetch(
			`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/validateCode`,
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
				console.log(data);
				return data.message;
			})
			.then((message) => {
				if (message === 'INVALID CODE') {
					const error = new Error('INVALID CODE');
					throw error;
				} else if (message === 'VALIDATE CODE CONFIRMED') {
					setValidateCodeMatchCheck(
						(validateCodeMatchCheck) => (validateCodeMatchCheck = true)
					);
				}
			})
			.catch((error) => console.error(error));
	};

	const checkRegexTest = (values) => {
		if (passwordRegex.test(values.password) === true) {
			return 'goodToGo';
		} else {
			return 'somethingWrong';
		}
	};

	const fetchResetPassword = (event) => {
		event.preventDefault();

		try {
			if (checkRegexTest(values) === 'somethingWrong') {
				const error = new Error('INVALID FOR REGEX');
				throw error;
			} else if (values.password !== values.passwordCrossCheck) {
				const error = new Error('PASSWORDS NO MATCH');
				throw error;
			}
			fetch(
				`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/users/checkUserMatch?name=${values.name}&email=${values.email}`
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.data.length === 0) {
						const error = new Error('NO USER IN DB');
						throw error;
					}
				})
				.then(() => {
					return fetch(
						`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/users/password`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(values),
						}
					);
				})
				.then((res) => res.json())
				.then((data) => console.log(data))
				.then(() => {
					Swal.fire({
						title: 'Password reset!',
						text: 'Hit the OK button to sign in',
						icon: 'success',
					});
				})
				.then(() => {
					navigate('/');
				});
		} catch (error) {
			console.error(error);
			Swal.fire({
				title: `Error occurred!`,
				icon: 'error',
				text: 'Please check data again',
				showConfirmButton: true,
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

	return (
		<div id="resetPasswordForm">
			<div id="titleBox">Chat With Dug</div>
			<form>
				<div className="elementRow">
					<div className="valueSort">Username</div>
					<input
						className="valueInputBox"
						type="text"
						name="name"
						maxLength="15"
						onBlur={(event) => {
							handleValueTouched(event);
						}}
						onChange={(event) => {
							handleValue(event);
						}}
					/>
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.name && touched.name ? <NoticeEmptyInputValue /> : null}
				</div>

				<div className="elementRow">
					<div className="valueSort">Email</div>
					<input
						ref={emailInputBox}
						disabled={!emailInputBoxToggle}
						type="email"
						className="valueInputBox"
						name="email"
						onChange={(event) => {
							fetchData('email', event.target.value);
							handleValue(event);
						}}
					/>
					<button
						type="button"
						onClick={() => {
							handleEmailValidateCodeBoxToggle();
							handleEmailInputBoxToggle();
							requestValidateCode();
						}}
						disabled={!checkDataExists || !emailInputBoxToggle}
						className="validateCodeSendButton"
					>
						Send validate code
					</button>

					{validateCodeBoxToggle ? (
						<div>
							<input
								id="emailValidateCodeInput"
								disabled={validateCodeInputBoxToggle}
								autoFocus={true}
								ref={emailValidateCheckInputBox}
								onChange={handleValidateCodeInputCheck}
								maxLength="6"
							/>
							<button
								className="emailValidateCodeButton"
								type="button"
								onClick={() => {
									handleSetEmailValidateInputBoxToggle();
									checkValidateCode();
									handleSetCheckSubmitValidateCode();
								}}
								disabled={!validateCodeInputCheck || checkSumbitValidateCode}
							>
								Confirm
							</button>
							{validateCodeInputBoxToggle ? (
								<div>
									<NoticeValidateCodeCheckResult
										props={validateCodeMatchCheck}
									/>
									<button
										type="button"
										className="emailValidateCodeButton "
										onClick={() => {
											handleEmailValidateCodeBoxToggle();
											handleEmailInputBoxToggle();
											handleSetEmailValidateInputBoxToggle();
											handleValidateCodeMatchCheck();
											handleResetValidateCodeInputCheck();
											handleSetCheckSubmitValidateCode();
										}}
									>
										Cancel
									</button>
								</div>
							) : (
								<NoticeValidateCodeSent />
							)}
						</div>
					) : null}
				</div>

				<div className="elementRow">
					<div className="valueSort">Password</div>
					<input
						className="valueInputBox"
						type="password"
						autoComplete="none"
						name="password"
						maxLength="16"
						onChange={(event) => {
							handleValue(event);
							handleSetRegexTest(event);
						}}
						onBlur={(event) => {
							handleValueTouched(event);
						}}
						disabled={!validateCodeMatchCheck}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.password && touched.password ? (
						<NoticeEmptyInputValue />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{(values.password && regexTest.password === false) ||
					values.password?.includes(' ') ? (
						<NoticeInvalidInputValue sort={'password'} />
					) : null}
				</div>

				{/*   */}
				{/* sort가 passwordCrossCheck일 경우 password값과 passwordCrossCheck값의 일치를 확인하는 컴포넌트 반환 */}

				<div className="elementRow">
					<div className="valueSort">Password Confirm</div>
					<input
						type="password"
						className="valueInputBox"
						autoComplete="none"
						name="passwordCrossCheck"
						onChange={(event) => {
							handleValue(event);
						}}
						onBlur={handleValueTouched}
						disabled={!validateCodeMatchCheck}
					/>
					{/*   */}
					{/* 사용자의 focus가 있었으나 입력값이 존재하지 않을 경우 안내문구 출력 */}
					{!values.passwordCrossCheck && touched.passwordCrossCheck ? (
						<NoticeEmptyInputValue />
					) : null}
					{/*   */}
					{/* 사용자의 입력값은 존재하나 정규식을 만족하지 않을 경우 안내문구 출력 */}
					{values.passwordCrossCheck !== undefined &&
					values.password !== values.passwordCrossCheck ? (
						<NoticeInvalidInputValue sort={'passwordCrossCheck'} />
					) : null}
				</div>
				{/*   */}
				<button
					type="submit"
					id="resetPasswordButton"
					onClick={(event) => fetchResetPassword(event)}
				>
					Reset Password
				</button>
			</form>
		</div>
	);
}
