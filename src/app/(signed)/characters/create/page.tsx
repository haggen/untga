"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Group } from "@/components/Group";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { useSession } from "@/components/SessionProvider";
import { Textarea } from "@/components/Textarea";
import { client } from "@/lib/client";
import { draw } from "@/lib/random";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheckBigIcon, Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

const names = [
  "Adalbert",
  "Adelheid",
  "Aedan",
  "Aelia",
  "Agrippa",
  "Agrippina",
  "Aisling",
  "Aldric",
  "Alfhild",
  "Anneliese",
  "Antonia",
  "Arianwen",
  "Arvid",
  "Asbjorn",
  "Astrid",
  "Aulus",
  "Balbina",
  "Balbus",
  "Baldwin",
  "Beatrix",
  "Beli",
  "Bergdis",
  "Bertram",
  "Bjorn",
  "Blathnaid",
  "Bran",
  "Brigid",
  "Brunhilde",
  "Brutus",
  "Caitrin",
  "Caius",
  "Camilla",
  "Caradoc",
  "Carys",
  "Cassia",
  "Cassius",
  "Cian",
  "Clotilda",
  "Clovis",
  "Conrad",
  "Cunegund",
  "Dagmar",
  "Decimus",
  "Deirdre",
  "Delyth",
  "Diederik",
  "Dietrich",
  "Disa",
  "Domitia",
  "Dorothea",
  "Drusilla",
  "Drusus",
  "Drystan",
  "Duncan",
  "Eberhard",
  "Eckhard",
  "Edda",
  "Edeltraud",
  "Einar",
  "Eir",
  "Eirikr",
  "Eithne",
  "Eluned",
  "Emrys",
  "Erik",
  "Erika",
  "Eudocia",
  "Ewan",
  "Fabia",
  "Faelan",
  "Falk",
  "Faustus",
  "Fenella",
  "Fergus",
  "Fiona",
  "Flavia",
  "Flavius",
  "Frauke",
  "Freydis",
  "Frida",
  "Frida",
  "Fridolin",
  "Frode",
  "Gaius",
  "Galen",
  "Galla",
  "Gawain",
  "Gerd",
  "Gerhard",
  "Gertrude",
  "Gisela",
  "Gorm",
  "Gracchus",
  "Grainne",
  "Gratiana",
  "Gudrun",
  "Gunhild",
  "Gunnar",
  "Gunther",
  "Gwen",
  "Hakon",
  "Halfdan",
  "Hallvard",
  "Hannibal",
  "Harald",
  "Hartmann",
  "Hedda",
  "Helga",
  "Helmine",
  "Helvia",
  "Hermann",
  "Hilda",
  "Hildegard",
  "Horatius",
  "Hortensia",
  "Hrolf",
  "Hugh",
  "Idris",
  "Idunn",
  "Ignatius",
  "Ingeborg",
  "Ingram",
  "Ingrid",
  "Iona",
  "Iovita",
  "Irmgard",
  "Irmin",
  "Isolde",
  "Iulia",
  "Ivar",
  "Ivar",
  "Johan",
  "Jorund",
  "Jorunn",
  "Jowan",
  "Julius",
  "Junia",
  "Justus",
  "Jutta",
  "Kari",
  "Karl",
  "Kaspar",
  "Katarina",
  "Katharina",
  "Keira",
  "Ketill",
  "Kieran",
  "Kolbein",
  "Kyna",
  "Lachlan",
  "Lagertha",
  "Laoise",
  "Leif",
  "Leopold",
  "Lieselotte",
  "Liv",
  "Livia",
  "Livius",
  "Lorcan",
  "Lucilla",
  "Lucius",
  "Ludwig",
  "Ludwiga",
  "Luned",
  "Mabon",
  "Mael",
  "Maeve",
  "Magnus",
  "Manfred",
  "Marcella",
  "Marcus",
  "Margrit",
  "Marta",
  "Mathilda",
  "Maximus",
  "Meinhard",
  "Minervina",
  "Morrigan",
  "Mundilfari",
  "Myrkjartan",
  "Nadja",
  "Nanna",
  "Nechtan",
  "Neratia",
  "Nero",
  "Nessa",
  "Niall",
  "Niamh",
  "Niklaus",
  "Njord",
  "Nona",
  "Norbert",
  "Norberta",
  "Numerius",
  "Octavia",
  "Olaf",
  "Opimius",
  "Oriana",
  "Orin",
  "Orla",
  "Orvar",
  "Osk",
  "Oswald",
  "Othilia",
  "Otho",
  "Ottilie",
  "Otto",
  "Ovidia",
  "Owain",
  "Padria",
  "Paulla",
  "Placidia",
  "Plautius",
  "Pryderi",
  "Publius",
  "Pwyll",
  "Quintina",
  "Quintus",
  "Ragnar",
  "Ragnhild",
  "Regulus",
  "Reinhard",
  "Rhiannon",
  "Rike",
  "Riordan",
  "Romulus",
  "Ronan",
  "Rosamund",
  "Roskva",
  "Rowan",
  "Rubria",
  "Rudolf",
  "Rufina",
  "Runa",
  "Runolf",
  "Sabina",
  "Saoirse",
  "Seamus",
  "Selwyn",
  "Senta",
  "Sertorius",
  "Servilia",
  "Servius",
  "Sibylle",
  "Siegfried",
  "Sigmund",
  "Sigrid",
  "Sigurd",
  "Sigyn",
  "Snorri",
  "Solveig",
  "Sorcha",
  "Steinar",
  "Styrbjorn",
  "Svana",
  "Svanhild",
  "Tacita",
  "Tadhg",
  "Taliesin",
  "Tegan",
  "Theobald",
  "Theodora",
  "Theresia",
  "Thora",
  "Thorbjorn",
  "Thorstein",
  "Till",
  "Tirion",
  "Titus",
  "Tove",
  "Trygve",
  "Tullia",
  "Tullius",
  "Tyr",
  "Uisdean",
  "Ula",
  "Ulf",
  "Ulrich",
  "Ulrike",
  "Una",
  "Urd",
  "Uther",
  "Valeria",
  "Valerius",
  "Vali",
  "Varius",
  "Vaughn",
  "Vebjorn",
  "Vedis",
  "Venusia",
  "Verena",
  "Vespasia",
  "Vespasian",
  "Veturia",
  "Vidar",
  "Viggo",
  "Virgil",
  "Vivienne",
  "Volker",
  "Vortigern",
  "Waldtraut",
  "Wilhelm",
  "Wilhelmine",
  "Wolfram",
  "Wyn",
  "Wynn",
  "Ylva",
  "Yngvar",
  "Yrsa",
  "Yseult",
];

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      client.users.characters.post({
        userId: session.userId,
        payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.users.queryKey(session.userId),
      });
      router.push("/characters");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutate(payload);
  };

  const typeRandomName = () => {
    if (inputRef.current) {
      inputRef.current.value = draw(names);
    }
  };

  return (
    <Group level={1} asChild>
      <main>
        <Group level={4} asChild>
          <header>
            <Heading asChild>
              <h1>Create new character</h1>
            </Heading>

            <p>
              Enter your character&apos;s details below. This is how you&apos;ll
              be known in this world.
            </p>
          </header>
        </Group>

        <Group level={2} asChild>
          <form onSubmit={onSubmit} aria-busy={isPending}>
            {error ? (
              <Alert type="negative">{JSON.stringify(error)}</Alert>
            ) : null}

            {data ? (
              <Alert type="positive">{JSON.stringify(data)}</Alert>
            ) : null}

            <Group level={3} asChild>
              <fieldset>
                <Field name="name" label="Name">
                  <Input
                    ref={inputRef}
                    type="text"
                    required
                    placeholder="e.g. Ragnar"
                    pattern="[a-zA-Z0-9\s]+"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={typeRandomName}
                  >
                    <Dices />
                  </Button>
                </Field>

                <Field name="description" label="Bio">
                  <Textarea
                    rows={3}
                    required
                    maxLength={256}
                    placeholder="e.g. The son of a blacksmith..."
                  />
                </Field>
              </fieldset>
            </Group>

            <footer className="flex items-center justify-end gap-2">
              <Button type="submit" size="default" disabled={isPending}>
                Create
                <CircleCheckBigIcon />
              </Button>
            </footer>
          </form>
        </Group>
      </main>
    </Group>
  );
}
