import React from 'react';
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: "8px" }} alt="" />
      <hr   />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}.png`}> @{propriedades.githubUser}</a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  );
}

function ProfileRelationsBox (propriedades){
  return (
    <ProfileRelationsBoxWrapper>
    <h2 className="smallTitle">
      {propriedades.nome} ({propriedades.array.length})
    </h2>
    <ul>
      {propriedades.array.slice(0,6).map((itemAtual) => {
        return (
          <li key={itemAtual}>
            <a href={`/users/${itemAtual}`} key={itemAtual}> <img src={`https://github.com/${itemAtual}.png`} />
              <span>{itemAtual}</span>
            </a>
          </li>
        );
      })}
    </ul>
  </ProfileRelationsBoxWrapper>

  )}
   


export default function Home() {
  const [comunidades, setComunidades] = React.useState([{
    title: 'Eu odeio acordar cedo',
    image:'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    
  }

]);
  //const comunidades = comunidades[0]
  //const alteradorDeComunidades/setComunidades = comunidades[1]

  const usuarioAleatorio = "karen-freitas";
  const pessoasFavoritas = [
    "juunegreiros",
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho",
    "guilhermesilveira"
  ];


//pegando um array de dados da API do GitHub
//useEffect - é executado sempre, quando algo altera na tela. COnsegue receber um segundo parâmetro(array) para ser executado só quando a página é recarregada.
//com um array vazio, é executado somente uma vez
  const [seguidores , setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch('https://api.github.com/users/karen-freitas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta) 
      })
    }, [])


  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={ function handleCriaComunidade(e){
              e.preventDefault()
              const dadosDoForm = new FormData(e.target)
              //console.log('Campo: ', dadosDoForm.get('title'))
              //console.log('Campo: ', dadosDoForm.get('image'))

              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image')

              }
              


              //comunidades.push('Alura Stars')
              const comunidadesAtualizadas = [...comunidades, comunidade]
              setComunidades(comunidadesAtualizadas)
              console.log(comunidades)
            }}>

              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              
             
             <button>
               Criar comunidade
             </button>


            </form>
          </Box>



        </div>
        <div className="profileRelationsArea" style={{ gridArea: "profileRelationsArea" }}>
          <ProfileRelationsBox array={seguidores.map(seguidor=>seguidor.login)} nome="Seguidores"/>
          <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
            <ul>
              {comunidades.slice(0,6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}> <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox array={pessoasFavoritas} nome="Amigos"/>
        </div>
      </MainGrid>
    </>
  );
}