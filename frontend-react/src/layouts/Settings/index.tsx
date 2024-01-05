import { useNavigate } from "react-router-dom";

import { LayoutBase } from "../";
import { ButtonCancel } from "../../components/Button/Cancel";
import { FormHeader } from "../../components/Form/Header";

export const LayoutSettings = ({ children }) => {
	const navigate = useNavigate();
	const { revoke } = useContext(AuthContext);

	const onClickLogout = useCallback(() => {
		revoke();
		navigate("/?offset=0#global");
	}, [revoke, navigate]);

	return (
		<LayoutBase>
			<div className="settings-page">
				<div className="container page">
					<div className="row">
						<div className="col-md-6 offset-md-3 col-xs-12">
							<FormHeader title="Your Settings" />

							{children}

							<hr />

							<ButtonCancel onClick={onClickLogout}>
								Or click here to logout.
							</ButtonCancel>
						</div>
					</div>
				</div>
			</div>
		</LayoutBase>
	);
};
