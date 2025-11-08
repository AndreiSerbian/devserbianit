const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Serbian IT Development</h1>
          <p className="text-xl text-muted-foreground">
            Комплексный подход к IT-решениям для бизнеса
          </p>
        </header>

        <main className="space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Калькулятор бюджета</h2>
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ставка, €/час</label>
                  <input type="number" defaultValue={30} min={1} className="w-full px-4 py-2 bg-background border border-input rounded-md" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Тип проекта</label>
                  <select className="w-full px-4 py-2 bg-background border border-input rounded-md">
                    <option>E-commerce</option>
                    <option>CRM/ERP</option>
                    <option>Admin panel</option>
                    <option>Telegram bot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Размер</label>
                  <select className="w-full px-4 py-2 bg-background border border-input rounded-md">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>

                <div className="pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-primary/10">
                      <div className="text-sm text-muted-foreground mb-1">Часы</div>
                      <div className="text-3xl font-bold text-primary">120</div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <div className="text-sm text-muted-foreground mb-1">Итого, €</div>
                      <div className="text-3xl font-bold text-primary">3600</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Скачать PDF
                  </button>
                  <a 
                    href="https://t.me/your_username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 text-center"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-8">Контакты</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="https://t.me/your_username"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-lg font-medium"
              >
                Написать в Telegram
              </a>
              <a 
                href="mailto:contact@serbian-it.dev"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 text-lg font-medium"
              >
                Email
              </a>
            </div>
            <p className="mt-8 text-muted-foreground">
              Молдова, ЕС, Россия • Remote work
            </p>
          </section>
        </main>

        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2025 Serbian IT Development. Professional IT solutions for business.
        </footer>
      </div>
    </div>
  );
};

export default Index;
