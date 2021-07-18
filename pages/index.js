import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

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
   


export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);
  //const comunidades = comunidades[0]
  //const alteradorDeComunidades/setComunidades = comunidades[1]

  const usuarioAleatorio = props.githubUser;
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
    fetch('https://api.github.com/users/githubUser/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta) 
      })

    // Requisições para a API GraphicQL

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers:{
        'Authorization': `e33b2b00337a9379d4ad80871deded`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          title
          id
          image
          creatorSlug
        }
      }`})

    })

    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
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
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
                creatorSlug: usuarioAleatorio,

              }
              
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                console.log(dados.registroCriado);
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)
              })
             
              
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

export async function getServerSideProps(context) {
  const cookies =  nookies.get(context)
  const token = cookies.USER_TOKEN
  const {githubUser} = jwt.decode(token)  // Destructuring passa entre chaves  nome da variável com o mesmo nome da chave
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  

  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}