interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ButtonLy = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <button disabled={true} className={""} {...rest}>
      {children}
    </button>
  );
};
