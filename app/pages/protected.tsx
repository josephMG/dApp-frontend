import Layout from '@/components/layout';
import fetcher from '@/libs/fetcher';
import { Button, Container, Grid, Stack, TextField, TextFieldProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
// import ContractABI from '@/contracts/Greeter.json';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    marginTop: 10,
    maxWidth: 1100,
    boxShadow: 'none',
  },
}));

const Protected = () => {
  const classes = useStyles();
  const textRef = useRef<TextFieldProps>(null);
  const { status } = useSession({
    required: true,
  });

  // const { signMessageAsync } = useSignMessage();
  const { config } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    contractInterface: ['function setGreeting(string)'],
    functionName: 'setGreeting',
    args: [''],
  });
  const { write } = useContractWrite(config);

  useEffect(() => {
    const fetchSession = async () => {
      await getSession();
    };
    fetchSession();
  }, []);

  const sendToBackend = async () => {
    const message = textRef.current?.value || '';
    await fetcher('/contract/greeting', 'POST', {
      dataObj: {
        greeting: message,
      },
    });
  };

  const sendToContract = async () => {
    const message = textRef.current?.value as string;
    // const signedMessage = await signMessageAsync({ message });
    // console.log(signedMessage);
    write?.({ recklesslySetUnpreparedArgs: [message] });
  };

  if (status === 'loading') {
    return <Layout title="Next.js protected">{'Loading or not authenticated...'}</Layout>;
  }

  return (
    <Layout title="Next.js protected">
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack direction="column" spacing={2}>
              <TextField
                id="sign-message"
                inputRef={textRef}
                label="Sign messages"
                placeholder="Please input message here"
                multiline
                fullWidth
                rows={4}
              />
              <Button onClick={sendToBackend} fullWidth color="secondary" variant="outlined">
                Send to backend
              </Button>
              <Button onClick={sendToContract} fullWidth color="secondary" variant="outlined">
                Send to contract
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

Protected.auth = true;

export default Protected;
