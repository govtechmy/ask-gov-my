export const dynamic = 'force-dynamic' // defaults to auto
export async function POST(props) {
    console.log('this is post request');
    return Response.json(props)
}
export async function GET(props) {
    console.log('this is a get request');
    return Response.json(props)
}
export async function DELETE(props) {
    console.log(props);
    return Response.json(props)
}
