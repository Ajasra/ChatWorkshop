import { Container, Title, Text } from "@mantine/core";

export default function ChatHistory(props) {
  const { conversation } = props;

  return (
    <>
      {conversation?.history != null ? (
        <>
          {conversation?.history.map((message, index) => (
            <Container
              key={"hist_" + index}
              mt={32}
              style={{ position: "relative" }}
            >
              <Title order={3} color="blue.6">
                {message.question}
              </Title>
              <Text>{message.response}</Text>
            </Container>
          ))}
        </>
      ) : (
        <div>
          New conversation. Please type your question and we would try to assist
          you.
        </div>
      )}
    </>
  );
}
