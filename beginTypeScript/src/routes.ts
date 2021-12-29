import { Request, Response } from "express"
import CreateCourseServices from "./CreateCourseServices"

export function createCourse(request: Request, response: Response){

    CreateCourseServices.execute({
        name: "NodeJS",
        educator: "Dani",
        duration: 10
    })

    return response.send()
}