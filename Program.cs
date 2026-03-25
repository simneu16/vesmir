using System;
using System.Linq.Expressions;

namespace Vesmir
{
    class Spaceship()
    {
        public string type;

        // stats
        public int maxHealth;
        public float currentHealth;
        public float damage;
        public float speed;
        public float material_capacity;
        public float shield;
        public float fuel;
        public int maxFuel;

        public float materials;
        public float spice;

        public int enemiesDestroyed;

        public Random rnd = new Random();

        public void Status()
        {
            Console.WriteLine("\n--- STAV LODE ---");
            Console.WriteLine("Typ lode: " + type);
            Console.WriteLine("Health: " + currentHealth + "/" + maxHealth);
            Console.WriteLine("Shield: " + shield);
            Console.WriteLine("Damage: " + damage);
            Console.WriteLine("Speed: " + speed);
            Console.WriteLine("Fuel: " + fuel);

            Console.WriteLine("Materiály: " + materials + "/" + Capacity());
            Console.WriteLine("Spice: " + spice);
        }

        public float Capacity()
        {
            float hRatio = currentHealth / maxHealth;
            return material_capacity * hRatio;
        }

        public void Prieskum()
        {
            int found = rnd.Next(1, 7);

            if (materials + found > Capacity())
            {
                Console.WriteLine("Nemáš dostatok kapacity pre nový materiál");
                Data.remainingActions++;
                return;
            }

            if (materials + found <= Capacity())
            {
                materials += found;
            }

            if (rnd.Next(0, 4) == 0)
            {
                Battle();
            }

            if (Data.day > 3)
            {
                if (rnd.Next(0, 7) % 2 == 0)
                {
                    int spiceFound = rnd.Next(1, (Data.day) + 3);
                    Console.WriteLine($"Našiel si spice. Množstvo: {spiceFound}");
                    this.spice += spiceFound;
                }
            }
        }

        void Battle()
        {
            Console.WriteLine("\nNarazil si na nepriateľskú loď!");

            float enemyHealth = rnd.Next(40, 70);
            float enemyDamage = rnd.Next(8, 15);

            while (enemyHealth > 0 && currentHealth > 0)
            {
                Console.WriteLine("\n1 - Útok");
                Console.WriteLine("2 - Útek");

                int choice = int.Parse(Console.ReadLine());

                if (choice == 1)
                {
                    enemyHealth -= damage;
                    Console.WriteLine("Zasiahol si nepriateľa.");
                    Console.WriteLine($"Zostávajúci život nepriateľa je: {enemyHealth}");
                    if (enemyHealth <= 0)
                    {
                        materials += 0;
                        spice += 0;
                        break;
                    }


                    float dmg = enemyDamage;

                    if (shield > 0)
                    {
                        shield -= dmg;
                        if (shield < 0)
                        {
                            currentHealth += shield;
                            shield = 0;
                        }
                    }
                    else
                        currentHealth -= dmg;

                    Console.WriteLine("Nepriateľ zasiahol tvoju loď.");
                    Console.WriteLine($"Spôsobil poškodenie vo výške {dmg}");
                }
                else
                {
                    if (rnd.Next(0, 2) == 0)
                    {
                        Console.WriteLine("Podarilo sa utiecť.");
                        return;
                    }
                    else
                    {
                        float dmg = enemyDamage;

                        if (shield > 0)
                        {
                            shield -= dmg;
                            if (shield < 0)
                            {
                                currentHealth += shield;
                                shield = 0;
                            }
                        }
                        else
                            currentHealth -= dmg;

                        Console.WriteLine("Útek zlyhal.");
                        Console.WriteLine($"Inkasuješ poškodenie vo výške: {dmg}");
                    }
                }
            }

            if (currentHealth > 0)
            {
                Console.WriteLine("Nepriateľ zničený!");
                enemiesDestroyed++;
            }
        }

        public void Repair()
        {
            float dmgToRepairF = maxHealth - currentHealth;
            int dmgToRepair = Convert.ToInt16(Math.Round(dmgToRepairF));

            Console.WriteLine($"Koľko materiálov z dostupných {Convert.ToInt16(materials)} chceš investovať?");
            int invest = Convert.ToInt16(Console.ReadLine());
            if (invest > materials)
            {
                Console.WriteLine("Nemáš dostatok materiálov");
            }

            if (invest > 0)
            {
                this.currentHealth += invest;
                this.materials -= invest;
            }

            if (currentHealth > maxHealth)
            {
                int excessHealth = Convert.ToInt16(currentHealth - maxHealth);
                currentHealth = maxHealth;
                shield += excessHealth;
            }
        }

        public void Refuel()
        {
            float toRefuelF = maxFuel - fuel;
            int toRefuel = Convert.ToInt16(toRefuelF);

            Console.WriteLine($"Koľko materiálov z dostupných {Convert.ToInt16(materials)} chceš investovať?");
            int invest = Convert.ToInt16(Console.ReadLine());
            if (invest > materials)
            {
                Console.WriteLine("Nemáš dostatok materiálov");
            }

            if (invest > 0)
            {
                this.fuel += invest;
                this.materials -= invest;
            }

            if (fuel > maxFuel)
            {
                int excessFuel = Convert.ToInt16(fuel - maxFuel);
                fuel = maxFuel;
                materials += excessFuel;
            }
        }
    }

    class Destroyer : Spaceship
    {
        public Destroyer()
        {
            type = "Destroyer";
            maxHealth = 100;
            currentHealth = 100;
            damage = 30;
            speed = 10;
            material_capacity = 20;
            shield = 20;
            fuel = 20;
            maxFuel = 30;
        }
    }

    class Harvester : Spaceship
    {
        public Harvester()
        {
            type = "Harvester";
            maxHealth = 70;
            currentHealth = 70;
            damage = 20;
            speed = 15;
            material_capacity = 40;
            shield = 30;
            fuel = 50;
        }
    }

    class Data()
    {
        public static int day = 1;
        public static int remainingActions = 5;
    }


    class Program()
    {
        static void Main(string[] args)
        {
            int warriorChoice = 0;
            Spaceship ship = null;

            //vyber lode
            Console.Write("<< CHOOSE YOUR WARRIOR >>\n1 - Destroyer\n2 - Harvester\n");
            while (true)
            {
                warriorChoice = Convert.ToInt16(Console.ReadLine());
                if (warriorChoice == 1)
                {
                    ship = new Destroyer();
                    Console.WriteLine("\nVybral si si 1 - Destroyer\n");
                    break;
                }
                else if (warriorChoice == 2)
                {
                    ship = new Harvester();
                    Console.WriteLine("\nVybral si si 2 - Harvester\n");
                    break;
                }
                else
                {
                    Console.WriteLine("\nVybral si neplatnú možnosť, vyber znova");
                }
            }

            Console.WriteLine("Pokračuj stlačením ľubovoľnej klávesy");
            Console.ReadLine();
            Console.Clear();

            while (true)
            {
                Console.WriteLine("\n=======================");
                Console.WriteLine("Loď: " + ship.type);
                Console.WriteLine("Deň: " + Data.day);
                Console.WriteLine("Akcie dnes zostávajú: " + Data.remainingActions);
                Console.WriteLine("Materiály: " + ship.materials);
                Console.WriteLine("Spice: " + ship.spice);
                Console.WriteLine("=======================");

                Console.WriteLine("1 - Prieskum");
                Console.WriteLine("2 - Oprava lode/štítu");
                Console.WriteLine("3 - Doplniť palivo");
                Console.WriteLine("5 - Stav lode");
                Console.WriteLine("6 - Upgrade za spice");
                Console.WriteLine("7 - Pokus o oslobodenie Venuše");
                Console.WriteLine("0 - Koniec hry");

                int action = Convert.ToInt16(Console.ReadLine());

                if (action == 0) break;
                if (action == 5)
                {
                    ship.Status();
                    continue;
                }

                switch (action)
                {
                    case 1:
                        ship.Prieskum();
                        Data.remainingActions--;
                        break;

                    case 2:
                        ship.Repair();
                        Data.remainingActions--;
                        break;
                }

                if (Data.remainingActions == 0)
                {
                    Data.remainingActions = 5;
                    Data.day++;
                }
            }
        }
    }
}