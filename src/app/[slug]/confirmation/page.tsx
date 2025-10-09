interface ConfirmationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    success: string;
  }>;
}

const ConfirmationPage = async ({ searchParams }: ConfirmationPageProps) => {
  const { success } = await searchParams;
  return (
    <>
      {success === 'true' && (
        <div>
          <h1>Sucesso</h1>
        </div>
      )}
      {success === 'false' && (
        <div>
          <h1>Deu ruim</h1>
        </div>
      )}
    </>
  );
};

export default ConfirmationPage;
