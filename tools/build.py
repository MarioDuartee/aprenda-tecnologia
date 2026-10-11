import re,json,glob
ORDER=[("Química","Química geral, inorgânica, físico-química, analítica e orgânica aplicadas às ciências da saúde."),("Biologia celular, molecular e genética","Célula, DNA, expressão gênica e hereditariedade."),("Anatomia, fisiologia e patologia","Estrutura e funcionamento do corpo humano e das doenças."),("Microbiologia, imunologia e parasitologia","Micro-organismos, defesa do organismo e parasitos."),("Psicologia","Teorias, processos psicológicos, avaliação e clínica."),("Enfermagem","Cuidado, assistência e sistematização da prática de enfermagem."),("Fisioterapia","Reabilitação e recursos terapêuticos por especialidade."),("Educação Física e esporte","Atividade física, treinamento, esporte e atuação profissional."),("Farmácia e farmacologia","Medicamentos, toxicologia, serviços e gestão farmacêutica."),("Nutrição e alimentos","Alimentação, avaliação nutricional e ciência dos alimentos."),("Biomedicina e análises clínicas","Laboratório clínico, hematologia, imunologia e diagnóstico."),("Estética, cosmética e pele","Pele, cosmetologia, drenagem linfática e mercado."),("Radiologia e imagem","Radiologia, radioproteção e diagnóstico por imagem."),("Medicina, clínica e urgência","Doenças, urgência, emergência e cuidado ao paciente crítico."),("Saúde coletiva, epidemiologia e SUS","SUS, atenção primária, saúde mental e epidemiologia."),("Saúde do trabalhador e ergonomia","Higiene ocupacional, ergonomia e doenças do trabalho."),("Gestão em saúde","Gestão hospitalar, qualidade, custos e pessoas."),("Veterinária, zootecnia e agrárias","Saúde e produção animal, aquicultura e agronegócio."),("Meio ambiente, ecologia e zoologia","Ecologia, educação ambiental, biodiversidade e plantas."),("Pesquisa, ética e estágio","Método científico, ética profissional e estágio.")]
import os,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P=lambda *a:os.path.join(ROOT,*a)
META=dict(id="sa",n="Saúde e Ciências da Vida",d="Do corpo humano à prática clínica: psicologia, enfermagem, fisioterapia, nutrição, farmácia e mais.",h=185,base="https://stecine.azureedge.net/repositorio/00212sa/",h1="Trilha de <em>Saúde e Ciências da Vida</em>")
def saude():
    T={};cur=sub=None
    for f in sorted(glob.glob(P("src","saude","saude_part*.txt"))):
        for l in open(f,encoding="utf-8").read().splitlines():
            if l.startswith("@"):cur=T.setdefault(l[1:],{})
            elif l.startswith("#"):sub=cur.setdefault(l[1:],[])
            elif "|" in l:
                p=l.split("|");it=[p[0].strip(),p[1].strip(),[a for a in (p[3].split(",") if len(p)>3 else []) if a]]
                if len(p)>2 and p[2]:it.append(p[2])
                sub.append(it)
    ts=[];k=0
    for n,d in ORDER:
        if n in T and any(T[n].values()):
            ts.append({"n":n,"d":d,"h":k*37%360,"s":[[s,x] for s,x in T[n].items() if x]});k+=1
    return dict(META,t=ts)
def main():
    if glob.glob(P("src","saude","saude_part*.txt")):
        json.dump(saude(),open(P("src","data","sa.json"),"w",encoding="utf-8"),ensure_ascii=False,indent=1)
    A=[json.load(open(P("src","data",i+".json"),encoding="utf-8")) for i in ("ti","hu","en","ge","sa")]
    mig=json.load(open(P("src","data","migracoes.json")))
    dados="window.DADOS="+json.dumps(A,ensure_ascii=False,separators=(",",":"))+";\nwindow.MIGRACOES="+json.dumps(mig,separators=(",",":"))+";\n"
    open(P("js","dados.js"),"w",encoding="utf-8").write(dados)
    h=open(P("index.html"),encoding="utf-8").read()
    h=h.replace('<link rel="stylesheet" href="css/style.css">',"<style>\n"+open(P("css","style.css"),encoding="utf-8").read()+"</style>")
    h=h.replace('<script src="js/dados.js"></script>',"<script>\n"+dados+"</script>").replace('<script src="js/app.js"></script>',"<script>\n"+open(P("js","app.js"),encoding="utf-8").read()+"</script>")
    open(P("dist","trilhas-de-ensino.html"),"w",encoding="utf-8").write(h)
    print(len(A),"trilhas;",sum(len(s[1]) for a in A for t in a["t"] for s in t["s"]),"aulas")
if __name__=="__main__":main()
