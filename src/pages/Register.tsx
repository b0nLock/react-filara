import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Select,
  Alert,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Logo from "../images/logo.png";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { setInfo } from "../features/auth/authSlice";
import { useRegisterMutation } from "../features/authApi";
import { useDispatch } from "react-redux";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

interface RegisterProps {
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ setIsAuthorized }) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [registerMutation, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const response = await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap();

      localStorage.setItem("token", response.token);
      dispatch(setInfo({ token: response.token }));

      setIsAuthorized(true);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      const message =
        err?.data?.message ||
        err?.error ||
        "Ошибка регистрации, попробуйте снова";
      setServerError(String(message));
    }
  };

  return (
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
              Регистрация учетной записи
            </Typography>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Ваше имя
              </Typography>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Имя обязательно",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Введите свое имя"
                    autoComplete="name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>

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
                    autoComplete="new-password"
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

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Подтвердите пароль
              </Typography>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Подтвердите пароль",
                  validate: (value) =>
                    value === getValues("password") || "Пароли не совпадают",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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

            {serverError && <Alert severity="error">{serverError}</Alert>}

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Роль
              </Typography>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
                      labelId="role-label"
                      value={field.value}
                    >
                      <MenuItem value="student">Студент</MenuItem>
                      <MenuItem value="teacher">Преподаватель</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ textTransform: "none", mt: 1 }}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <Button
              type="button"
              variant="text"
              fullWidth
              color="secondary"
              sx={{ textTransform: "none", mt: 0.5, fontWeight: 500 }}
              onClick={() => navigate("/login")}
            >
              Уже есть аккаунт? Войти
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
