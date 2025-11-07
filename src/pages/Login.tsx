import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import Logo from "../images/logo.png";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setInfo } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/authApi";
import { useDispatch } from "react-redux";

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthorized }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "", remember: false },
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      localStorage.setItem("token", response.token);
      dispatch(setInfo({ token: response.token }));

      if (!data.remember) console.log("Don't remember login");
      else console.log("Remember login");

      setIsAuthorized(true);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      const message =
        err?.data?.message || err?.error || "Ошибка входа, попробуйте снова";
      setServerError(message);
    }
  };

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{ width: "244px", height: "auto", mb: 8, objectFit: "contain" }}
        />

        <Paper
          elevation={6}
          sx={{ width: "100%", px: 3, py: 4, borderRadius: 2 }}
        >
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={500}>
                Вход в учетную запись
              </Typography>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  E-mail
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email обязателен",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Неверный формат email",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Введите свой e-mail"
                      autoComplete="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Пароль
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Пароль обязателен",
                    minLength: { value: 6, message: "Минимум 6 символов" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Введите пароль"
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                onMouseDown={(e) => e.preventDefault()}
                                edge="end"
                                aria-label={
                                  showPassword
                                    ? "Скрыть пароль"
                                    : "Показать пароль"
                                }
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Запомнить меня"
                    sx={{ userSelect: "none", mt: 1 }}
                  />
                )}
              />

              {serverError && <Alert severity="error">{serverError}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ textTransform: "none", mt: 1 }}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>

              <Button
                type="button"
                variant="text"
                fullWidth
                color="secondary"
                sx={{ textTransform: "none", mt: 0.5, fontWeight: 500 }}
                onClick={() => console.log("Forgot password clicked")}
              >
                Забыли пароль?
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
